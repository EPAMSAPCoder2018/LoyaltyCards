$.import("utils", "requestUtil");
$.import("utils", "dbUtil");

var type = $.request.method;
var responseBody = {};
switch ($.request.method) {
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