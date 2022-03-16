import { abcText } from "./annotationsActions";
import { contextObj } from "./transpose";
export const isHeaderLine=(line:abcText) => /[A-Z]:/i.test(line);

export const separateHeaderAndBody = (text: abcText, context: contextObj)=>{
   const lines = text.split(/\n/g);
   let header = [];
   let i=-1;
   while (true){
    i+=1;
    if (isHeaderLine(lines[i])){
        header.push(lines[i])     
    } else break;
   }
   const headerText = header.join("\n");
   const bodyText = lines.slice(i).join("\n");

   return {headerText, bodyText};
}

