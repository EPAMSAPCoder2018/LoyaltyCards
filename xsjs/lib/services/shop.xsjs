$.import("utils", "requestUtil");
$.import("utils", "dbUtil");

var type = $.request.method;
var responseBody = {};
switch ($.request.method) {
case $.net.http.GET:
	var shopId = $.request.parameters.get("id");
	responseBody = shopId ? getShopById(shopId) : getShops();
	break;

case $.net.http.POST:
	responseBody = createShop();
	break;
}
$.xs.requestUtil.prepareResponse(responseBody);

function createShop() {
	var connection = $.xs.dbUtil.getConnection();
	var shopData = $.xs.requestUtil.extractMultiPartParameters();
	if (shopData && Object.keys(shopData).length > 0) {
		//ID;shopName;shopSite;logo
		try {
			var shopID = connection.executeQuery('SELECT "seq::shopsSeq".nextVal "ID" FROM DUMMY')[0].ID;
			shopData.shopID = shopID;
			var insertShopStatement = 'INSERT INTO "LoyaltyCards.Shops" VALUES(?,?,?,?,?,?,?)';
			connection.executeUpdate(insertShopStatement, shopID, shopData.shopName, shopData.shopSite, shopData.shopAddress, shopData.shopEmail, shopData.phoneNumber, shopData.logo.data);
			connection.commit();
		} catch (e) {
			connection.rollback();
			throw e;
		}
	}
	return shopData;
}

function getShops() {
	var connection = $.xs.dbUtil.getConnection();
	//ID;shopName;shopSite;logo
	try {
		var shops = connection.executeQuery('SELECT * FROM "LoyaltyCards.Shops"');
		return shops;
	} catch (e) {
		throw e;
	}
}

function getShopById(id) {
	var connection = $.xs.dbUtil.getConnection();
	//ID;shopName;shopSite;logo
	try {
		var shop = connection.executeQuery('SELECT * FROM "LoyaltyCards.Shops" WHERE "ID"=?', id);
		return shop;
	} catch (e) {
		throw e;
	}
	return shopData;
}