
function EditableList(pageName, container) {

	this.pageName = pageName;
	this.container = container;
	this.hidden = true;
	this.hideable = "button.remove,button.up,button.down,form#links";
	this.selectedIndex = null;

	this.ajaxPost = function(url, data, success) {
		$.ajax({
			url: url,
			data: data,
			method: "POST",
			success: success
		});
	};

	this.ajaxPut = function(url, data, success) {
		$.ajax({
			url: url,
			data: data,
			method: "PUT",
			success: success
		});
	};

	this.ajaxDelete = function(url, success) {
		$.ajax({
			url: url,
			method: "DELETE",
			success: success
		});
	};

	this.handleEnd = function(condition, buttonSelector) {
		var button = this.container.find(buttonSelector);
		if (condition) {
			button.hide();
		} else {
			button.show();
		}
	}

	this.moveSelected = function(step) {
		var aList = this.container.find("a.link");
		var otherIndex = this.selectedIndex + step;
		this.handleEnd((otherIndex == 0), "button.up");
		this.handleEnd((otherIndex == (aList.length - 1)), "button.down");
		var selected = $(aList[this.selectedIndex]);
		var other = $(aList[otherIndex]);
		var updates = [this.linkUpdate(other), this.linkUpdate(selected)];
		var self = this;
		this.sendUpdates(this.selectedIndex + "," + otherIndex, updates, function(data) {
			selectedClone = selected.clone();
			otherClone = other.clone();
			selected.replaceWith(otherClone);
			other.replaceWith(selectedClone);
			self.selectedIndex = otherIndex;
		});
	};

	this.paragraphClickHandler = function(event) {
		var list = event.data;
		var thisIndex = list.container.find("p").index(this);
		if (list.selectedIndex) {
			var selected = list.container.find("p")[list.selectedIndex];
			$(selected).find("a").css("color", "black");
		}
		if (thisIndex == list.selectedIndex) {
			list.container.find(list.hideable).hide(); // TODO: make a helper function
			list.selectedIndex = null;
		} 
		else {
			list.container.find(list.hideable).show(); // TODO: make a helper function
			$(this).find("a").css("color", "red");
			list.selectedIndex = thisIndex;
		}
	};

	this.container.find(this.hideable).hide();

	this.container.find("button.remove").click(this, function(event) {
		var list = event.data;
		list.sendRemove(function(data) {
			var selected = list.container.find("p")[list.selectedIndex];
			selected.remove();
			list.selectedIndex = null;
			list.container.find(list.hideable).hide();	
		});
	});

	this.container.find("button.up").click(this, function(event) {
		event.data.moveSelected(-1);
	});

	this.container.find("button.down").click(this, function(event) {
		event.data.moveSelected(1);
	});

	this.container.find("p").click(this, this.paragraphClickHandler);
}

