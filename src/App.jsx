import { useRef, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import html2pdf from 'html2pdf.js';
import './App.css';

export default function App() {
  const editorRef = useRef(null);
  const [imageUrl, setImageUrl] = useState('');

  const convertToPdf = () => {
    if (editorRef.current) {
      const content = editorRef.current.getContent();
      const parser = new DOMParser();
      const doc = parser.parseFromString(content, 'text/html');
      const innerContent = doc.body.querySelector('div').outerHTML;

      const element = document.createElement('div');
      element.innerHTML = innerContent;

      const opt = {
        margin: 0,
        filename: 'page_content.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'px', format: [1224, 792], orientation: 'landscape' }
      };

      html2pdf().set(opt).from(element).save();
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageUrl(e.target.result);
        if (editorRef.current) {
          const editor = editorRef.current;
          const content = editor.getContent();
          const updatedContent = content.replace(
            /<div style="flex: 36; background-color: #f0f0f0;"><\/div>/,
            `<div style="flex: 36; background-color: #f0f0f0; display: flex; justify-content: center; align-items: center;">
              <img src="${e.target.result}" style="max-width: 100%; max-height: 100%; object-fit: contain;" alt="Uploaded image"/>
            </div>`
          );
          editor.setContent(updatedContent);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const htmlTemplate = `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Page Template</title>
      <style>
          body, html {
              margin: 0;
              padding: 0;
              height: 100%;
          }
      </style>
  </head>
  <body>
      <div style="width: 1224px; height: 792px; border: 4px solid black; box-sizing: border-box; display: flex; flex-direction: column;">
          <div style="display: flex; height: 100%;">
              <div style="flex: 36; background-color: #f0f0f0;">
              <img src="https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg" alt="no img" style="height:25%; width:25%;" ></img>
              </div>
              <div style="width: 16px;"></div>
              <div style="flex: 32; background-color: #e0e0e0;"></div>
              <div style="width: 16px;"></div>
              <div style="flex: 22; background-color: #d0d0d0;"></div>
              <div style="width: 16px;"></div>
              <div style="flex: 10; background-color: #c0c0c0;"></div>
          </div>
      </div>
  </body>
  </html>`;

  return (
    <>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      <Editor
        apiKey='m7gwupvn328xdzusn6wc1nfq5tfl0dk488mxxl9bmbf56d4e'
        onInit={(_evt, editor) => editorRef.current = editor}
        initialValue={htmlTemplate}
        init={{
          height: 1000,
          menubar: false,
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
          ],
          toolbar: 'undo redo | blocks | ' +
            'bold italic forecolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat | help',
          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
        }}
      />
      <button onClick={convertToPdf}>Convert to PDF</button>
    </>
  );
}