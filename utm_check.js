function renderItem(item, itemClass, parentItemId, message) {
    var resultItem = document.createElement(item);
    resultItem.className = itemClass;
    document.getElementById(parentItemId).appendChild(resultItem);
    if (message){
        var result_message = document.createTextNode(message);
        resultItem.appendChild(result_message);
    }
    return resultItem;
}


function renderTextItems(item, parentItem, message){
    var resultItem = document.createElement(item);
    parentItem.appendChild(resultItem);
    var result_message = document.createTextNode(message);
    resultItem.appendChild(result_message);
}


function printResult(){
    result = checkUtm();
    elem = document.getElementById('result_area');
    //если кол-во не совпадает
    if (result.status === "not_equal_length"){
        var resultDiv = renderItem('div', 'failed', 'content-block');
        renderTextItems('div', resultDiv, 'UTM-метки содержат разное кол-во параметров!');
        var result_message_count_exp = 'Ожидаемое кол-во элементов: ' + result.expected_count;
        renderTextItems('div', resultDiv, result_message_count_exp);
        var result_message_count_act = 'Фактическое кол-во элементаов: ' + result.actual_count;
        renderTextItems('div', resultDiv, result_message_count_act);
    }
    //если не совпадают между собой, при одинаковом кол-ве
    else if (result.status === false){
        var resultDiv = renderItem('div', 'failed', 'content-block');
        renderTextItems('div', resultDiv, 'UTM-метки не совпадают!');
        var result_message_count_exp = 'Ожидаемые элменеты: ' + result.expected_utms;
        renderTextItems('div', resultDiv, result_message_count_exp);
        var result_message_count_act = 'Элементы, которые не найдены: ' + result.compare_result;
        renderTextItems('div', resultDiv, result_message_count_act);
    }
    //если все совпадает
    else {
        renderItem("div", "success", "content-block", result.message);
    }

}


//проверка на равенство UTM-ок
function checkUtm(){
   var utm_expected = document.getElementById('expected_utm_field').value;
   var utm_actual = document.getElementById('actual_utm_field').value;
   var expected_utms = utm_expected.split('&');
   var actual_utms = utm_actual.split('&');


   // if (utm_expected.length && utm_actual.length === 0) {
   //      return {
   //          "status": 
   //      }
   // }

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
