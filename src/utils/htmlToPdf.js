import html2Canvas from 'html2canvas'
import JsPDF from 'jspdf'

function getPdf (idStr, title) {
    html2Canvas(document.querySelector('#' + idStr), {
        // allowTaint: true,
        useCORS: true,
        // scale: 2, // 提升画面质量，但是会增加文件大小
        }).then((canvas) => {
        const contentWidth = canvas.width
        const contentHeight = canvas.height

        let pageHeight = contentWidth / 592.28 * 841.89
        let leftHeight = contentHeight
        // pdf页面向上偏移
        let position = 0
        // a4纸的尺寸[595.28,841.89]，html页面生成的canvas在pdf中图片的宽高
        let imgWidth = 595.28
        let imgHeight = 592.28 / contentWidth * contentHeight
        let pageData = canvas.toDataURL('image/jpeg', 1.0)  //转换图片为dataURL
        let pdf = new JsPDF('', 'pt', 'a4')
        // 有两个高度需要区分，一个是html页面的实际高度，和生成pdf的页面高度(841.89)
        // 当内容未超过pdf一页显示的范围，无需分页
        if (leftHeight < pageHeight) {
            pdf.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight)
        } else {
            while(leftHeight > 0) {
            pdf.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight)
            leftHeight -= pageHeight
            position -= 841.89
            //避免添加空白页
            if(leftHeight > 0) {
                pdf.addPage()
            }
            }
        }

        pdf.save(title + '.pdf')
    })
}

export default {
    getPdf,
}



