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
	・http://blog.webcreativepark.net/2007/08/01-135601.html
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
	var id_count = 0,c_count = 0;
	var ninzu;

	//----------------------------
	//小物
	//----------------------------
	
	function $(id) {
		return document.getElementById(id);
	}
	function c$(id) {
		return document.getElementByClassName(id);
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
        for (i = 0;i < members.length;i++){
        	if (members[i].length <= 1){members[i]+="　"}
        }
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
		id_count = 1;

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
			c_count = ninzu*ninzu - i;
			for ( j = 0 ; j < 2 ; j++){
				for ( k = 0 ; k < ninzu ; k++){
					
					if ( j == 0 && k == slash_count ){
						league_hyou += slash;
						league_hyou += '<a id="number' +id_count+ '"></a>' 
						slash_count -= 1;
						id_count += 1;
						c_count -= ninzu;

					}else{
						if ( j === 0 ){
							league_hyou += "│";
							league_hyou += '<a id="number' +id_count+ '" class="'+c_count+'" onclick="vic_or_def('+id_count+')">';
							league_hyou += "＿";
							league_hyou += "</a>";
							id_count += 1;
							c_count -= ninzu;


						}
						if ( j === 1){
							league_hyou += keisen2[j];
						}
					}

				}
				if ( j == 0 ) {
					league_hyou += "│"+'<span id="katisu'+i+'">'+"＿"+"</span>"+"－"+'<span id="makesu'+i+'">'+"＿"+"</span>"+"│namae";
					
				}
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
	
	//半角文字列なら半角スペースを追加（ズレ対策）
	function getByte(word) {//http://www.openspc2.org/reibun/javascript/string/026/
		n = escape(word);
		if ( n.length < 4 || word == " "){
			return word + "&nbsp;";
		}
		else{
			return word;
		}
	}
	
	function wl_records(){//勝ち数、負け数を追加
		var n = ninzu * ninzu,
			win=[],
			lose=[];
		
		for ( i = 0 ; i < ninzu ; i++){win[i] = 0;lose[i] = 0;}
		for ( j = 1; j <= n ; j++){
			if ( $('number'+j+'').innerHTML === "○" ){win[Math.floor((j-1)/ninzu)] += 1;}
			if ( $('number'+j+'').innerHTML === "●" ){lose[Math.floor((j-1)/ninzu)] += 1;}
		}
		for ( i = 0 ; i < ninzu ; i++){
			$('katisu'+i+'').innerHTML = ( win[i] >= 10 ) ? win[i] : win[i] + " "; 
			$('makesu'+i+'').innerHTML = ( lose[i] >= 10 ) ? lose[i] : lose[i] + " ";
		}
		return true;
		
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
	
	
	function vic_or_def(n) {//http://d.hatena.ne.jp/hichame/20090730/1248915884
		f = parseInt($('number'+n+'').getAttribute('class'));
		if ( $('number'+n+'').innerHTML === "＿" ){$('number'+n+'').innerHTML = "○"; $('number'+f+'').innerHTML = "●";}
		else if ( $('number'+n+'').innerHTML === "○" ) {$('number'+n+'').innerHTML = "●"; $('number'+f+'').innerHTML = "○";}
		else if ( $('number'+n+'').innerHTML === "●" ) {$('number'+n+'').innerHTML = "△"; $('number'+f+'').innerHTML = "△";}
		else if ( $('number'+n+'').innerHTML === "△" ) {$('number'+n+'').innerHTML = "＿" ; $('number'+f+'').innerHTML = "＿";}
		wl_records();
		return false
	}
	
	document.make = make;
	document.vic_or_def = vic_or_def;