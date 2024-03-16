// deno-lint-ignore-file
export enum TokenType {
Number,
Lpran,
Rpran,
Identifier,
BinaryOperator,
Equals,
Let,
Const,
Eof,
skip,
Colon,
Print,
Quotes,
String,
SemiColon,
Function,
LBrack,
RBrack,
NewLine,
If,
Else,
Import,
From,
Export,
}
export interface Token{
    value: string,
    type: TokenType,
}
const Keywords:Record<string,TokenType> = {
   "Let": TokenType.Let,
   "Const": TokenType.Const,
   "Print": TokenType.Print,
   "Func": TokenType.Function,
   "If": TokenType.If,
   "Else": TokenType.Else,
   "Import": TokenType.Import,
   "From": TokenType.From,
   "Export": TokenType.Export,
}
function token(value = "", type:TokenType, ){
   return{value, type}
} 

export function isInt(str:string){
      return(str=='0' || str=='1' || str=='2' ||str=='3' || str=='4' || str=='5' || str=='6' ||str=='7' || str=='8' ||str=='9')
}

function isAlpha(src: string){
    return src.toUpperCase() != src.toLowerCase();
  }

export function Tokenize(sourceCode:string):Token[]{
     const tokens = new Array<Token>
     const src = sourceCode.split("")
     while(src.length>0){
        if(src[0]=='+'){ 
            tokens.push(token(src.shift(), TokenType.BinaryOperator,))
        } else if(src[0]=='-'){ 
            tokens.push(token(src.shift(), TokenType.BinaryOperator,))
        } else if(src[0]=='*'){ 
            tokens.push(token(src.shift(), TokenType.BinaryOperator,))
        } else if(src[0]=='/'){ 
            tokens.push(token(src.shift(), TokenType.BinaryOperator,))
        }  else if(src[0]=='='){ 
            tokens.push(token(src.shift(), TokenType.Equals))

        }
        else if(src[0]==';'){
            tokens.push(token(src.shift(), TokenType.SemiColon))
        } else if(src[0]=='('){ 
            tokens.push(token(src.shift(), TokenType.Lpran))
        } else if(src[0]==')'){ 
            tokens.push(token(src.shift(), TokenType.Rpran))
        } else if(src[0]==':'){
            tokens.push(token(src.shift(), TokenType.Colon))
        } else if(src[0]=='"'){
            tokens.push(token(src.shift(), TokenType.Quotes ))
              
        } else if(src[0] == '{'){
            tokens.push(token(src.shift(), TokenType.LBrack))
        } else if(src[0] == '}'){
            tokens.push(token(src.shift(), TokenType.RBrack))
        }
              
            
                
        
        else{
            

           if(isInt(src[0])){
            let num = "";
            while(isInt(src[0])&&src.length>0){
                num+=src.shift()
            }
            tokens.push(token(num, TokenType.Number))
           }
           else if(isAlpha(src[0])){
            let ident = "";
             while(src.length > 0 && isAlpha(src[0])){
                ident += src.shift()
             }
             //check for reserved keyWords
             const reserved = Keywords[ident];
             if (reserved) {
                tokens.push(token(ident, reserved));
             
            }
                else {
                // Unreconized name must mean user defined symbol.
                tokens.push(token(ident, TokenType.Identifier));
            }
        } else if(src[0] == ' ' ||src[0]=='\t'){
            tokens.push(token(src.shift(), TokenType.skip))
        } 
        else if(src[0] == '\n'){
            tokens.push(token(src.shift(), TokenType.NewLine))
        }
        else{
           tokens.push(token(src.shift(), TokenType.skip))
        }
    }
 }      tokens.push({value: "EndofFile", type:TokenType.Eof})
        return tokens;
     }
