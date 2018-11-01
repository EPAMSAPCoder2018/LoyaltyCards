$.import("utils", "requestUtil");
$.import("utils", "dbUtil");

var type = $.request.method;
var responseBody = {};
switch ($.request.method) {
case $.net.http.GET:
	var id = $.request.parameters.get("id");
	responseBody = id ? getCustomerById(id) : getCustomers();
	break;
case $.net.http.POST:
	responseBody = createCustomer();
	break;
}
$.xs.requestUtil.prepareResponse(responseBody);

function createCustomer() {
	var connection = $.xs.dbUtil.getConnection();
	var customerData = $.xs.requestUtil.extractMultiPartParameters() || JSON.parse($.request.body.asString());
	if (customerData && Object.keys(customerData).length > 0) {
		// /*ID <INTEGER>*/,
		// ''/*lastName <NVARCHAR(50)>*/,
		// ''/*firstName <NVARCHAR(50)>*/,
		// ''/*middleName <NVARCHAR(50)>*/,
		// ''/*bDay <DATE>*/,
		// ''/*sex <NVARCHAR(10)>*/,
		// ''/*telNumber <NVARCHAR(30)>*/,
		// ''/*email <NVARCHAR(50)>*/
		try {
			var customerID = connection.executeQuery('SELECT "seq::customerSeq".nextVal "id" FROM DUMMY')[0].id;
			customerData.customerID = customerID;
			var insertCustomerStatement = 'INSERT INTO "LoyaltyCards.Customers" VALUES(?,?,?,?,?,?,?,?)';
			connection.executeUpdate(insertCustomerStatement, customerID, customerData.lastName, customerData.firstName, customerData.middleName,
				customerData.bDay + " 00:00:00.0", customerData.sex, customerData.telNumber, customerData.email);
			//AK: check staging for images
			if (!customerData.photos || customerData.photos.length !== 3) {
				var selectPhotoStatement = 'SELECT "photo" "data" FROM "LoyaltyCards.photoStaging"';
				customerData.photos = connection.executeQuery(selectPhotoStatement);
			}

			if (customerData.photos && customerData.photos.length === 3) {
				// /*id <INTEGER>*/,
				// /*customerId <INTEGER>*/,
				// ''/*photo <BLOB>*/
				var insertPhotosStatement = 'INSERT INTO "LoyaltyCards.CustomersPhoto" VALUES("seq::customerPhotoSeq".nextVal,?,?)';
				var dataToInsert = [];
				for (var i = 0; i < customerData.photos.length; i++) {
					dataToInsert.push([customerID, customerData.photos[i].data]);
				}
				connection.executeUpdate(insertPhotosStatement, dataToInsert);
				var clearStagingStatement = 'DELETE FROM "LoyaltyCards.photoStaging"';
				connection.executeUpdate(clearStagingStatement);
			} else {
				throw "Not enough photos(required 3) for creating customer account";
			}
			connection.commit();
		} catch (e) {
			connection.rollback();
			throw e;
		}
	}
	return customerData;
}

function getCustomers() {
	var connection = $.xs.dbUtil.getConnection();
	// /*ID <INTEGER>*/,
	// ''/*lastName <NVARCHAR(50)>*/,
	// ''/*firstName <NVARCHAR(50)>*/,
	// ''/*middleName <NVARCHAR(50)>*/,
	// ''/*bDay <DATE>*/,
	// ''/*sex <NVARCHAR(10)>*/,
	// ''/*telNumber <NVARCHAR(30)>*/,
	// ''/*email <NVARCHAR(50)>*/
	var shopId = $.request.parameters.get("shopId");
	try {
		if (shopId) {
			var selectCustomersStatement =
			'SELECT * FROM "LoyaltyCards.Cards" CRD ' + 
			'INNER JOIN "LoyaltyCards.Customers" CST ON CST."ID"=CRD."customerId" ' + 
			'INNER JOIN ( ' +
				'SELECT "customerId", MAX(MAP("index", 1, "id", null)) AS "photo1", MAX(MAP("index", 2, "id", null)) AS "photo2", MAX(MAP("index", 3, "id", null)) AS "photo3" ' + 
				'FROM "LoyaltyCards.Customers" ' + 
				'INNER JOIN ( ' + 
					'SELECT ROW_NUMBER() OVER(PARTITION BY "customerId" ORDER BY "id" ASC) AS "index", * ' + 
					'FROM "LoyaltyCards.CustomersPhoto" ' + 
				') ON "customerId"="ID" ' + 
				'GROUP BY "customerId" '  + 
			') CSP ON CSP."customerId"=CST."ID" ' + 
			'WHERE CRD."shopId"=? ORDER BY CST."firstName"';
			//	'SELECT * FROM "LoyaltyCards.Cards" CRD INNER JOIN "LoyaltyCards.Customers" CST ON CST."ID"=CRD."customerId" WHERE CRD."shopId"=? ORDER BY CST."firstName"';
			var res = $.xs.dbUtil.clone(connection.executeQuery(selectCustomersStatement, shopId));
			res = res.map(function (item, i) {
				return {
					customer: {
						"ID": item.ID,
						"lastName": item.lastName,
						"firstName": item.firstName,
						"middleName": item.middleName,
						"bDay": item.bDay,
						"sex": item.sex,
						"telNumber": item.telNumber,
						"email": item.email,
						"photo1": item.photo1,
						"photo2": item.photo2,
						"photo3": item.photo3
					},
					card: {
						"id": item.id,
						"shopId": item.shopId,
						"cardNumber": item.cardNumber,
						"customerId": item.customerId,
						"discount": item.discount,
						"points": item.points
					},
					index : i
				};
			});
			return res;
		} else {
			var selectCustomersStatement = 'SELECT * FROM "LoyaltyCards.Customers" ORDER BY 2';
			return connection.executeQuery(selectCustomersStatement);
		}
	} catch (e) {
		throw e;
	}
	return customerData;
}

function getCustomerById(id) {
	var connection = $.xs.dbUtil.getConnection();
	// /*ID <INTEGER>*/,
	// ''/*lastName <NVARCHAR(50)>*/,
	// ''/*firstName <NVARCHAR(50)>*/,
	// ''/*middleName <NVARCHAR(50)>*/,
	// ''/*bDay <DATE>*/,
	// ''/*sex <NVARCHAR(10)>*/,
	// ''/*telNumber <NVARCHAR(30)>*/,
	// ''/*email <NVARCHAR(50)>*/
	try {
		var selectCustomersStatement = 'SELECT * FROM "LoyaltyCards.Customers" WHERE "ID"=? ORDER BY 2';
		var res = connection.executeQuery(selectCustomersStatement, id);
		return res.length > 0 ? res[0] : {};
	} catch (e) {
		throw e;
	}
	return customerData;
}