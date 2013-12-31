function PageList() {

	this.linkUpdate = function(a) {
		return ({
			name: a.attr("href").split("/").pop(),
			title: a.text()
		});
	};

	this.sendUpdates = function(indexList, updates, callback) {
		this.ajaxPut("/api/pages/" + this.pageName + "/pages/" + indexList, {updates: updates}, callback);
	};

	this.sendInsert = function(index, update, callback) {
		this.ajaxPost("/api/pages/" + this.pageName + "/pages/" + index, update, callback);
	};

	this.sendRemove = function(callback) {
		this.ajaxDelete("/api/pages/" + this.pageName + "/pages/" + this.selectedIndex, callback);
	};

	this.getLink = function() {
		var name = $("input#pageName").val();
		var title = $("input#pageTitle").val();
		return {
			data: {name: name, title: title},
			http: '<p class="link"><a class="link" href="/pages/' + name + '">' + title + '</a></p>'
		}
	};

	EditableList.apply(this, arguments);

	this.container.find("form#pages").dialog(this.addLinkHandlerFactory(this, "Add page"));

	this.container.find("button.add").click(this, function(event) {
		//event.data.container.find("form#pages").dialog("open"); // TODO: why doesn't this work?
		$("form#pages").dialog("open");
	});
}

PageList.prototype = Object.create(EditableList.prototype);
PageList.prototype.constructor = PageList;
