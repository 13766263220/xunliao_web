/* 解析表情符号 */
function convertStr2Emoji(str) {
  let regExp = /\[:[a-zA-Z-_]+:\]/g;
  let arrRegExp = [];
  let temp = [];
  while ((temp = regExp.exec(str)) != null) {
    arrRegExp.push(temp);
  }
  let arrRes = [];
  let iStart = 0;
  let iEnd = str.length;
  arrRegExp.forEach(function(oRes){
    iEnd = oRes["index"];
    if(iStart != iEnd){
      let oText = {
        t: 0,
        m: str.slice(iStart, iEnd)
      };
      arrRes.push(oText);
    }

    let oEmoji = {
      t: 1,
      m: getEmojiId(oRes[0])
    };
    arrRes.push(oEmoji);

    iStart = iEnd + oRes[0].length;
    iEnd = str.length;
  });
  if(iStart != iEnd){
    let oText = {
      t: 0,
      m: str.slice(iStart, iEnd)
    };
    arrRes.push(oText);
  }

  return arrRes;
};

export {
  convertStr2Emoji
};

