// $.import("utils","requestUtil");
// $.import("utils","dbUtil");

var type = $.request.method;
var responseBody = {};
switch ($.request.method) {
case $.net.http.POST:
	responseBody = createCustomer();
	break;
}
$.xs.requestUtil.prepareResponse(responseBody);

var createCustomer = function(){
	return "hello";//$.xs.requestUtil.extractMultiPartParameters();
} 