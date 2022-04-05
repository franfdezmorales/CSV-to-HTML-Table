import { readFile, writeFile } from "fs/promises"
import jsdom from 'jsdom'
import { createInterface } from "readline"

const readLine = createInterface({
    input: process.stdin,
    output: process.stdout
})

const getFileData = async (path: string): Promise<Buffer> => {
    const file: Buffer = await readFile(path)
    return file
}

const readFileData = async (data: Buffer): Promise<string> => {
    const file: string = data.toString()
    return file
}

const convertFileData = (file: string): Array<string> => { 
    const convertedFile: Array<string> = file.split('\n')
    return convertedFile
}

const formatToHTML = (file: Array<string>): string => {
    let HTML_FILE: string = ''

    for (let i = 1; i < file.length; i++) {
        HTML_FILE += `<tr><td>${file[i].split(',').join('</td><td>')}</td></tr>`
    }

    return `<table>${HTML_FILE}</table>`
}

const convertStringToHTML = (file: string): Document => {

    const dom: jsdom.JSDOM = new jsdom.JSDOM(file)
    const HTMLDocument: Document = dom.window.document

    return HTMLDocument
}

const writeHTML = async (HTMLDocument: Document): Promise<void> => { 
    const HTML_FILE: string = HTMLDocument.body.innerHTML
    const STRUCTURED_HTML: string = `<!DOCTYPE html><html><head><title>Table</title></head><body>${HTML_FILE}</body></html>`
    await writeFile('index.html', STRUCTURED_HTML)
}

const main = async (): Promise<void> => { 
    readLine.question('Enter the path of the file: ', async (path: string) => { 
        const file: Buffer = await getFileData(path)
        const fileData: string = await readFileData(file)
        const fileArray: Array<string> = convertFileData(fileData)
        const HTMLDocument: Document = convertStringToHTML(formatToHTML(fileArray))
        await writeHTML(HTMLDocument)
        console.log(`Document successfully created at index.html`)
        readLine.close()
    })
}

main()




