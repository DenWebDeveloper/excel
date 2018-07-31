import React, {Component} from 'react'

import DropZone from './DropZone'
import ExcelTable from './ExcelTable'

import './style.css'

class Root extends Component {
    static defaultProps = {};

    static propTypes = {};

    state = {
        arrayExcel: [],
        file: null,
        hasError: false,
    };

    handleExcel(arrayExcel, file) {
        this.setState(() => ({
            arrayExcel,
            file
        }))
    };

    hasError() {
        return <div className='error'>Возможно вы изменили в ручную расширения любого другого файла на xls(xlsx)
            или файл является поврежден или еще что-то.
            Чтобы продолжить работу с сайтом пожалуйста обновите страницу</div>
    }

    componentDidCatch() {
        this.setState(() => ({
            hasError: true,
        }))
    }

    render() {
        const {file, hasError} = this.state;
        if (hasError) return this.hasError();
        return (
            <div>
                <DropZone
                    sizeBytes={1024 * 1024 * 10}
                    handleExcel={this.handleExcel.bind(this)}
                    attributesForInput={{
                        id: 'idForInput',
                        name: 'nameForInput',
                    }}
                />
                <ExcelTable file={file}/>
            </div>
        );
    }
}

export default Root
