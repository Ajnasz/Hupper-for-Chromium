var TreeView;
(function () {
    var CellEditor = function (cell) {
        this.cell = cell;
        this.value = cell.innerHTML;
    };
    CellEditor.prototype = new HupEvent();
    CellEditor.prototype.getRowIndex = function () {
    };
    CellEditor.prototype.addEditor = function () {
        var input = document.createElement('input');
        input.type = 'text';
        input.value = this.value;
        this.cell.innerHTML = '';
        this.cell.appendChild(input);
        input.addEventListener('keyup', this.keyup.bind(this), false);
        input.focus();
        this.input = input;
    };
    CellEditor.prototype.keyup = function (e) {
        switch (e.keyCode) {
        case 13:
            this.saveValue();
            break;
        case 27:
            this.removeEditor();
            break;
        }
    };
    CellEditor.prototype.saveValue = function () {
        this.value = this.input.value;
        this.fireEvent('valueSaved');
        this.removeEditor();
    };
    CellEditor.prototype.removeEditor = function () {
        this.input.removeEventListener('keyup', this.keyup.bind(this), false);
        this.cell.removeChild(this.input);
        this.cell.appendChild(document.createTextNode(this.value));
        this.input = null;
        this.fireEvent('setCellText');
    };
    CellEditor.prototype.startEdit = function () {
        this.addEditor();
    };
    Object.defineProperty(CellEditor.prototype, 'cellIndex', {
        get: function () {
            var row = this.cell.parentNode,
                myCell = this.cell,
                cells = Array.prototype.slice.call(row.getElementsByTagName('td')),
                cellIndex = -1;
            cells.forEach(function (cell, index) {
                if (myCell === cell) {
                    cellIndex = index;
                    return false;
                }
            });
            return cellIndex;
        }
    });
    Object.defineProperty(CellEditor.prototype, 'rowIndex', {
        get: function () {
            var myRow = this.cell.parentNode,
                tbody = myRow.parentNode,
                rows = Array.prototype.slice.call(tbody.getElementsByTagName('tr')),
                rowIndex = -1;
            rows.forEach(function (row, index) {
                if (row === myRow) {
                    rowIndex = index;
                    return false;
                }
            });
            return rowIndex;
        }
    });
    Object.defineProperty(CellEditor.prototype, 'value', (function () {
        var value;
        return {
            set: function (val) {
                value = val;
            },
            get: function () {
                return value;
            }
        };
    }()));


    TreeView = function (container, data) {
        var scope = {}, table, me = this;
        table = this.genTree(data);
        document.getElementById(container).appendChild(table);
        table.addEventListener('dblclick', function (e) {
            var target = e.target;
            if (target.nodeName === 'TD') {
                me.startCellEdit(target);
            }
        }, false);
    };
    TreeView.prototype = new HupEvent();
    TreeView.prototype.genTree = function (dataSet) {
        if (dataSet.length > 0) {
            var me = this,
                table = document.createElement('table'),
                keys = Object.keys(dataSet[0]),
                rowTpl = document.createElement('tr'),
                headRow = rowTpl.cloneNode(true),
                cellTpl = document.createElement('td'),
                thTpl = document.createElement('th'),
                thead, tbody;
            this.keys = keys;
            this.table = table;
            thead = document.createElement('thead');
            tbody = document.createElement('tbody');
            table.appendChild(thead);
            table.appendChild(tbody);
            Object.keys(dataSet[0]).forEach(function (key) {
                var th = thTpl.cloneNode(true);
                th.appendChild(document.createTextNode(key));
                headRow.appendChild(th);
            });
            thead.appendChild(headRow);
            dataSet.forEach(function (rowData) {
                me.addRow(rowData);
            });
            this.addClass(table, 'tree');
            return table;
        }
    };
    TreeView.prototype.addClass = function (elem, cl) {
        var className = elem.className,
            classes = className.split(' ');
        if (classes[0] === '') {
            classes.shift();
        }
        if (!this.hasClass(elem, cl)) {
            classes.push(cl);
        }
        elem.className = classes.join(' ');
    };
    TreeView.prototype.removeClass = function (elem, cl) {
        var className = elem.className,
            classes = className.split(' '),
            output = classes;
        if (this.hasClass(elem, cl)) {
            output = classes.filter(function (i) {
                return i !== cl;
            });
        }
        elem.className = output.join(' ');
    };
    TreeView.prototype.hasClass = function (elem, cl) {
        var className = elem.className,
            classes = className.split(' ');
        return classes.some(function (i) {
            return i === cl;
        });
    };
    TreeView.prototype.addRow = function (rowData) {
        var row = document.createElement('tr'),
            cellTpl = document.createElement('td'),
            tbody = this.table.getElementsByTagName('tbody')[0],
            me = this;
        this.keys.forEach(function (key) {
            var cell = cellTpl.cloneNode(true),
                cellData = rowData[key];
            cell.appendChild(document.createTextNode(cellData.text));
            if (cellData.editable) {
                me.setEditable(cell);
            }
            me.setColName(cell, key);
            row.appendChild(cell);
        });
        tbody.appendChild(row);
        cellTpl = null;
    };
    TreeView.prototype.addEmptyRow = function () {
        var data = {};
        this.keys.forEach(function (key) {
            data[key] = {
                text: '',
                editable: true
            };
        });
        this.addRow(data);
        this.fireEvent('emptyRowAdded');
    };
    TreeView.prototype.removeRow = function (index) {
        var tbody = this.table.getElementsByTagName('tbody')[0],
            rows = tbody.getElementsByTagName('tr');

        console.log(tbody, rows[index]);
        tbody.removeChild(rows[index]);
        this.fireEvent('removeRow', index);
    };
    TreeView.prototype.removeLastRow = function () {
        var rows = this.table.getElementsByTagName('tbody')[0].getElementsByTagName('tr').length;
        this.removeRow(rows - 1);
    };
    TreeView.prototype.cellEditable = function (cell) {
        return cell.dataset.editable === 'true';
    };
    TreeView.prototype.setEditable = function (cell) {
        cell.dataset.editable = 'true';
    };
    TreeView.prototype.unsetEditable = function (cell) {
        delete cell.dataset.editable;
    };
    TreeView.prototype.setColName = function (cell, name) {
        cell.dataset.colname = name;
    };
    TreeView.prototype.getColName = function (cell) {
        return cell.dataset.colname;
    };
    TreeView.prototype.underEditing = function () {
        return this.cellEditor instanceof CellEditor;
    };
    TreeView.prototype.startCellEdit = function (cell) {
        if (this.cellEditable(cell) && !this.underEditing()) {
            var me = this;
            this.cellEditor = new CellEditor(cell);
            this.cellEditor.startEdit();
            this.cellEditor.on('setCellText', function () {
                me.fireEvent('setCellText', {
                    value: this.value,
                    rowIndex: this.rowIndex,
                    colName: me.getColName(this.cell),
                    cellIndex: this.cellIndex
                });
                me.cellEditor = null;
            });
        }
    };
}());
