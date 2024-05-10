
// スクリプトタグのソースに貼ってあるurlのパラメータをを取得する(ドメインID)
const script = document.querySelector("script[data-config]")
// 

let url = ""
let id = ""
if(script.getAttribute("data-config") == "KD_tagadmin"){
  url = new URL(script.src)
  id = new URLSearchParams(url.search).get("id")
}



const fetchTagData = () => {

  

  // 広告コードを取得する
  const code = new URLSearchParams(window.location.search).get("c")
  const data = { id: id, code: code };


 
  return fetch("https://tag-admin.info/processTagData/fetchIndexTagApi.php", {
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
      document.head.innerHTML += tagHead
      // タグbodyはDOMが完全にロードされてから実行さる


      // HTMLの解析が完了している場合、executeScript 関数を直ちに実行
      if (document.readyState !== 'loading') {
        document.body.innerHTML += tagBody
        executeScript(tagBody, document.body);
        // もしドキュメントの状態がまだ 'loading' の場合、DOMContentLoaded イベントが発火するのを待ち、その時点で executeScript 関数を実行
      } else {
        window.addEventListener('DOMContentLoaded', () => {
          document.body.innerHTML += tagBody
          executeScript(tagBody, document.body);
        });
      }
    }
  })


  const executeScript = (data)=>{

    //文字列をウェブページの一部として読むことができる特別なツール(DomParser)
    var parser = new DOMParser();
    // data変数に含まれるHTML文字列を解析し、DOM（Document Object Model）の構造に変換

    /*

    (例)    data = "<script>console.log("222222")</script>"

              →<script><script>console.log("222222")</script> ドキュメントオブジェクトに変換したが、中身はセキュリティ上実行されない
    */
    var doc = parser.parseFromString(data, "text/html");
    // <script> タグを抽出
    var scripts = doc.getElementsByTagName("script");



    // 抽出したスクリプトを実行
    for (var i = 0; i < scripts.length; i++) {
    
        eval(scripts[i].textContent);
     
    }
  }



