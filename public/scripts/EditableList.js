
function EditableList(pageName, container) {

	this.pageName = pageName;
	this.container = container;
	this.hidden = true;
	this.hideable = "button.add,button.remove,button.up,button.down,form#links";
	this.selectedIndex = null;

	this.moveSelected = function(step) {
		var aList = this.container.find("a.link");
		var otherIndex = this.selectedIndex + step;
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
		var thisIndex = $(this).index('p');
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

