function LinkList() {

	this.linkUpdate = function(a) {
		return ({
			url: a.attr("href"),
			label: a.text()
		});
	};

	this.sendUpdates = function(indexList, updates, callback) {
		$.ajax({
			url: "/api/pages/" + this.pageName + "/links/" + indexList,
			data: {updates: updates},
			method: "PUT",
			success: callback
		});
	};

	this.sendInsert = function(index, update, callback) {
		$.ajax({
			url: "/api/pages/" + this.pageName + "/links/" + index,
			data: update,
			method: "POST",
			success: callback
		});
	};

	this.sendRemove = function(callback) {
		$.ajax({
			url: "/api/pages/" + this.pageName + "/links/" + this.selectedIndex,
			method: "DELETE",
			success: callback
		});
	};

	EditableList.apply(this, arguments);
}

LinkList.prototype = Object.create(EditableList.prototype);
LinkList.prototype.constructor = LinkList;
