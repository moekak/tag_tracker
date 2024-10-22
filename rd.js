// スクリプトタグのソースに貼ってあるurlのパラメータをを取得する(ドメインID)
const script = document.querySelector("script[data-config]")
const scripts = document.getElementsByTagName("script")

let url = ""
let id = ""

if(script == null){
  url = new URL(scripts[0].src)
  id = new URLSearchParams(url.search).get("id")
}
if(script !== null && script.getAttribute("data-config") == "KD_tagadmin"){
  url = new URL(script.src)
  id = new URLSearchParams(url.search).get("id")
}

const fetchTagData = () => {

  // 広告コードを取得する
  const code = new URLSearchParams(window.location.search).get("c")
  const data = { id: id, code: code };

  return fetch("https://tag-admin.info/processTagData/fetchRdTagApi.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then((response) => {
    if (!response.ok) {
      throw new Error("サーバーエラーが発生しました。");
    }

    return response.json();
  });
};

fetchTagData()
  .then((data) => {
    if(data.length > 0){
      let tagHead = data[0]
      let tagBody = data[1]

      // タグheadを実行
      executeScript(tagHead)
      // document.head.innerHTML += tagHead
      // タグbodyはDOMが完全にロードされてから実行さる
      // HTMLの解析が完了している場合、executeScript 関数を直ちに実行
      if (document.readyState !== 'loading') {
        // document.body.innerHTML += tagBody
        executeScript2(tagBody, document.body);
        // もしドキュメントの状態がまだ 'loading' の場合、DOMContentLoaded イベントが発火するのを待ち、その時点で executeScript 関数を実行
      } else {
        window.addEventListener('DOMContentLoaded', () => {
          // document.body.innerHTML += tagBody
          executeScript2(tagBody, document.body);
        });
      }
    }
    
  })


  const executeScript = (data)=>{

    //文字列をウェブページの一部として読むことができる特別なツール(DomParser)
    var parser = new DOMParser();
    // data変数に含まれるHTML文字列を解析し、DOM（Document Object Model）の構造に変換
    var doc = parser.parseFromString(data, "text/html");
    // <script> タグを抽出
    var scripts = doc.getElementsByTagName("script");

    for (var i = 0; i < scripts.length; i++) {
  
      if(scripts[i].async == true){
        const newScript = document.createElement('script');
        newScript.src = scripts[i].src;
        newScript.async = true;
        document.head.appendChild(newScript);
      }else{
          const newScript = document.createElement('script');
          let scriptHTML = scripts[i].outerHTML.replace(/<script[^>]*>/i, "").replace(/<\/script>/i, "");
          newScript.textContent = scriptHTML;

          document.head.appendChild(newScript)
      }

    }
  }

  const executeScript2 = (data)=>{

    //文字列をウェブページの一部として読むことができる特別なツール(DomParser)
    var parser = new DOMParser();
    var doc = parser.parseFromString(data, "text/html");
    // <script> タグを抽出
    var scripts = doc.getElementsByTagName("script");

    // 抽出したスクリプトを実行
    for (var i = 0; i < scripts.length; i++) {
  
      if(scripts[i].async == true){
        const newScript = document.createElement('script');
        newScript.src = scripts[i].src;
        newScript.async = true;
        document.body.appendChild(newScript);
      }else{
          const newScript = document.createElement('script');
          let scriptHTML = scripts[i].outerHTML.replace(/<script[^>]*>/i, "").replace(/<\/script>/i, "");
          newScript.textContent = scriptHTML;
          document.body.appendChild(newScript)
      }
  }
}


