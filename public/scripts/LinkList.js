function LinkList() {

	this.linkUpdate = function(a) {
		return ({
			url: a.attr("href"),
			label: a.text()
		});
	};

	this.sendUpdates = function(indexList, updates, callback) {
		this.ajaxPut("/api/pages/" + this.pageName + "/links/" + indexList, {updates: updates}, callback);
	};

	this.sendInsert = function(index, update, callback) {
		this.ajaxPost("/api/pages/" + this.pageName + "/links/" + index, update, callback);
	};

	this.sendRemove = function(callback) {
		this.ajaxDelete("/api/pages/" + this.pageName + "/links/" + this.selectedIndex, callback);
	};

	this.getLink = function() {
		var label = $("input#linkLabel").val();
		var url = $("input#linkUrl").val();
		return {
			data: {label: label, url: url},
			http: '<p class="link"><a class="link" href="' + url + '" target="_blank">' + label + '</a></p>'
		}
	};

	EditableList.apply(this, arguments);

	this.container.find("form#links").dialog(this.addLinkHandlerFactory(this, "Add link"));

	this.container.find("button.add").click(this, function(event) {
		//event.data.container.find("form#links").dialog("open"); // TODO: why doesn't this work?
		$("form#links").dialog("open");
	});
}

LinkList.prototype = Object.create(EditableList.prototype);
LinkList.prototype.constructor = LinkList;
