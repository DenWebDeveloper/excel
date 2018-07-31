import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Parser from 'html-react-parser';
import XLSX from 'xlsx'

import './style.css'

class Table extends Component {
    static defaultProps = {};

    static propTypes = {
        file: PropTypes.object
    };

    generateHtmlTable() {
        const {file} = this.props;
        if (!file) return null;
        const wb = XLSX.read(file, {type: 'array',cellStyles:true});
        const first_worksheet = wb.Sheets[wb.SheetNames[0]];
        const html = XLSX.utils.sheet_to_html(first_worksheet, {header: '', footer: ''});
        return Parser(html);
    }

    render() {
        return (
            <div>
                {this.generateHtmlTable()}
            </div>
        );
    }
}

export default Table
