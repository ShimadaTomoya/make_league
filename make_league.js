	//リーグ表生成ツール
	/*
	設計方針覚書
	①textareaから名前一覧を取得→配列に格納
	②とりあえず人数分のリーグ表を生成する
	③該当部分（名前部分）を置換する
	④HTMLへ出力する
	
	参考文献
	・山田祥寛『JacaScript本格入門』（2010,技術評論社）
	・https://dl.dropboxusercontent.com/u/27191410/t/tournament.html
	・http://www.openspc2.org/reibun/javascript/string/026/
	*/
	
	//----------------------------
	//変数、定数、罫線
	//----------------------------

	var keisen1 = ["┬─","│itimojime","│nimojime","┼─"],
		keisen2 = ["│＿","┼─"],
		keisen3 = ["┼───┼────"],
		keisen4 = ["│＿－＿│namae"],
		slash	= "│／";
	var slash_count;
	//
	var league_hyou = ""; //リーグ表大元
	var i,j,k;
	var members = [];

	//----------------------------
	//小物
	//----------------------------
	
	function $(id) {
		return document.getElementById(id);
	}
	function br() {
		league_hyou += "<br />";
		return;
	}
	
	//----------------------------
	//メンバー取得
	//----------------------------

	function cano(member_list) {
        var i, n,
            list = [];
        for (i in member_list) {
            if (member_list.hasOwnProperty(i)) {
                n = htmlspecialchars(member_list[i]);
                if (n !== "") {
                    list.push(n);
                }
            }
        }
        return list;
    }
	
	function member_update() {
        members = cano($('member').value.split("\n"));
        return;
    }
    
    function htmlspecialchars(sentence){
		n = sentence.replace(/<|>|&|\"/gi,"");

		return n;
	}

	//----------------------------
	//メイン
	//----------------------------

	function league_init() {//リーグ表を作る
		ninzu = members.length;
		league_hyou = "";
		slash_count = ninzu - 1;

		for( j = 0 ; j < 4 ; j++ ){
		
			for( i = 0 ; i < ninzu ; i++){
				league_hyou += keisen1[j] ;
			}
			
			if (j == 0) {league_hyou += "┐";}
			if (j == 1) {league_hyou += "├───┬────";}
			if (j == 2) {league_hyou += "│勝－負│＝名前＝";}
			if (j == 3) {league_hyou += "┼───┼────";}
			br();
		}
		
		for ( i = 0 ; i < ninzu ; i++){
			for ( j = 0 ; j < 2 ; j++){
				for ( k = 0 ; k < ninzu ; k++){
					
					if ( j == 0 && k == slash_count ){
						league_hyou += slash;
						slash_count -= 1;
					}
					else{
						league_hyou += keisen2[j];
					}
				}
				if ( j == 0 ) {league_hyou += keisen4;}
				if ( j == 1 ) {league_hyou += keisen3;}
				
				br();
			}
		}
	}
	
	function name_replace() {//名前を追加（置換）

		for ( i = 0 ; i < ninzu ; i++){
			league_hyou = league_hyou.replace(/namae/i,members[i]);			
			league_hyou = league_hyou.replace(/itimojime/i,getByte(members[ninzu - i -1].slice(0,1)));
			league_hyou = league_hyou.replace(/nimojime/i,getByte(members[ninzu - i -1].slice(1,2)));
		}
		
	}
	
	//半角文字列なら半角スペース追加（ズレ対策）
	function getByte(word) {//http://www.openspc2.org/reibun/javascript/string/026/
		n = escape(word);
		if ( n.length < 4 ){
			return word + " ";
		}
		else{
			return word;
		}
	}

	function draw(){
		$('area').innerHTML = league_hyou;
	}
	

	function make() {
		member_update();
		league_init();
		name_replace();
		draw();
	}
	
	document.make = make;