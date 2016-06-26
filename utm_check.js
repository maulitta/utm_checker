function print_result(){
    result = check_utm();
    elem = document.getElementById('result_area');
    //если кол-во не совпадает
    if (result.status === "not_equal_length"){
        var resultDiv = document.createElement('div');
        resultDiv.className = 'failed';
        document.getElementById("content-block").appendChild(resultDiv);
        var result_message_title = document.createTextNode('UTM-метки содержат разное кол-во параметров!\n');
        var result_message_count_exp = document.createTextNode('Ожидаемое кол-во элемента(ов): ' + result.expected_count +'\n');
        var result_message_count_act = document.createTextNode('Фактическое кол-во элемента(ов): ' + result.actual_count + '\n');
        var text = document.createElement('pre');
        resultDiv.appendChild(text);
        text.appendChild(result_message_title);
        text.appendChild(result_message_count_exp);
        text.appendChild(result_message_count_act);
    }
    //если не совпадают между собой, при одинаковом кол-ве
    else if (result.status === false){
        var resultDiv = document.createElement('div');
        resultDiv.className = 'failed';
        document.getElementById("content-block").appendChild(resultDiv);
        var result_message_title = document.createTextNode('UTM-метки не совпадают!\n');
        var result_message_count_exp = document.createTextNode('Ожидаемая последовательность: ' + result.expected_utms +'\n');
        var result_message_count_act = document.createTextNode('Элементы, которые не найдены: ' + result.compare_result + '\n');
        var text = document.createElement('pre');
        resultDiv.appendChild(text);
        text.appendChild(result_message_title);
        text.appendChild(result_message_count_exp);
        text.appendChild(result_message_count_act);

    }
    //если все совпадает
    else {
        var resultDiv = document.createElement('div');
        resultDiv.className = 'success';
        document.getElementById("content-block").appendChild(resultDiv);
        var result_message_title = document.createTextNode(result.message);
        resultDiv.appendChild(result_message_title);
    }

}


//проверка на равенство UTM-ок
function check_utm(){
   var utm_expected = document.getElementById('expected_utm_field').value;
   var utm_actual = document.getElementById('actual_utm_field').value;
   var expected_utms = utm_expected.split('&');
   var actual_utms = utm_actual.split('&');

   if (!(expected_utms.length === actual_utms.length)){
        return {
            "status": "not_equal_length",
            "expected_count": expected_utms.length,
            "actual_count": actual_utms.length
        }
    }

    var compare_result = []; 
    for (var i = 0; i < expected_utms.length; i++){
        if (!expected_utms.includes(actual_utms[i])){
            compare_result.push(actual_utms[i]);
        }
    }

    if (compare_result.length === 0){
        return {
            "status": true,
            "message": "UTM-метки полностью совпадают"
        }
    }

    return {
        "status": false,
        "expected_utms": expected_utms,
        "compare_result": compare_result
    }
}
