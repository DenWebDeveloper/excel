import React, {Component, createRef} from 'react'
import PropTypes from 'prop-types'
import XLSX from 'xlsx'
import Dropzone from 'react-dropzone'

import './style.css'

class DropZone extends Component {

    constructor(props) {
        super(props);

        this.wrapperInput = createRef();
        this.styleState = {
            backgroundColor: '#e0ffff'
        }
    }

    static propTypes = {
        sizeBytes: PropTypes.number.isRequired,
        handleExcel: PropTypes.func.isRequired,
        attributesForInput: PropTypes.object
    };

    state = {
        file: null,
        isAccept: null,
        fileExt: null,
        fileName: null,
        isBig: null
    };

    checkType(name) {
        const parts = name.split('.');
        const ext = parts[parts.length - 1];
        return {isAccept: ext === 'xls' || ext === 'xlsx', ext}

    }

    onDrop(file) {
        if (!file[0]) {
            this.setState(() => ({
                isBig: true
            }));
            this.props.handleExcel([], null);
            return null
        }
        const fileInfo = this.checkType(file[0].name);
        if (!fileInfo.isAccept) {
            this.setState(() => ({
                isAccept: false,
                fileExt: fileInfo.ext,
                isBig: false
            }));
            this.props.handleExcel([], null);
            return null
        }


        this.setState(() => ({
            file: file[0],
            fileName: file[0].name,
            isAccept: true,
            fileExt: fileInfo.ext,
            isBig: false
        }))
    }

    parseExcel(file) {
        const wb = XLSX.read(file, {type: 'array'});
        const first_worksheet = wb.Sheets[wb.SheetNames[0]];
        const dataJson = XLSX.utils.sheet_to_json(first_worksheet);
        this.props.handleExcel(dataJson, file)
    }

    readFile() {
        const file = this.state.file;
        const that = this;
        fetch(file.preview).then((res) => {
            if (!res.ok) throw new Error('fetch failed');
            return res.blob();
        }).then((blob) => {
            const reader = new FileReader();
            reader.addEventListener('loadend', function () {
                const data = new Uint8Array(this.result);
                that.parseExcel(data)

            });
            reader.readAsArrayBuffer(blob);
        });
    }

    getStatusText() {
        const {styleState, state} = this;
        const {isBig, isAccept, fileExt, fileName} = state;
        if (isBig) {
            styleState.backgroundColor = '#48c0c0';
            return 'Допустимый размер 10Мб, выберете другой файл';
        }
        if (!isAccept && isAccept !== null) {
            styleState.backgroundColor = '#add6e5';
            return `Недопустимый тип файла '.${fileExt}' выберете другой файл'`;
        }
        if (isAccept) {
            styleState.backgroundColor = '#e0ffff';
            return `Файл-'${fileName}'`;
        }
        return 'Перетащите сюда файл или нажмите чтобы выбрать'
    }

    componentDidUpdate() {
        const {file} = this.state;
        if (file) {
            this.readFile();

            this.setState(() => ({
                file: null
            }))
        }
    }

    componentDidMount() {
        const {attributesForInput} = this.props;
        if (!attributesForInput && typeof attributesForInput !== 'object') return null;

        const input = this.wrapperInput.current.querySelector('input[type=file]');
        for (let key in attributesForInput) {
            if (key.match(/[^a-zA-Z]+/) === null) {
                input.setAttribute(key, attributesForInput[key])
            }
        }
    }

    render() {
        const {styleState, props} = this;
        const {sizeBytes} = props;
        return (
            <div ref={this.wrapperInput}>
                <Dropzone
                    style={styleState}
                    className='dropzone'
                    activeClassName='active'
                    multiple={false}
                    maxSize={sizeBytes}
                    onDrop={this.onDrop.bind(this)}>

                    <p>{this.getStatusText()}</p>

                </Dropzone>
            </div>
        )
    }
}

export default DropZone
