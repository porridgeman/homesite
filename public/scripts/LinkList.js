
function LinkList(pageName, container) {

	this.pageName = pageName;
	this.container = container;
	this.hidden = true;
	this.hideable = "button.add,button.remove,button.up,button.down,form#links";
	this.selectedIndex = null;

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
		var self = event.data;
		var thisIndex = $(this).index('p');
		if (self.selectedIndex) {
			var selected = self.container.find("p")[self.selectedIndex];
			$(selected).find("a").css("color", "black");
		}
		if (thisIndex == self.selectedIndex) {
			$(self.hideable).hide(); // TODO: make a helper function
			self.selectedIndex = null;
		} 
		else {
			$(self.hideable).show(); // TODO: make a helper function
			$(this).find("a").css("color", "red");
			self.selectedIndex = thisIndex;
		}
	};

	this.addLinkHandlerFactory = function(list) {
		return {
			autoOpen: false,
			height: 150,
			width: 420,
			modal: true,
			buttons: {
				"Add link": function() {
					var label = $("input#linkLabel").val();
					var url = $("input#linkUrl").val();
					var self = this;
					list.sendInsert(list.selectedIndex, {label: label, url: url}, function(data) {
						$('<p class="link"><a class="link" href="' + url + '" target="_blank">' + label + '</a></p>').click(list, list.paragraphClickHandler).insertBefore(list.container.find("p")[list.selectedIndex]);
						list.selectedIndex++;
						$(self).dialog( "close" );
					});	
				},
				Cancel: function() {
					$(this).dialog( "close" );
				}
			}
		};
	};

	$(this.hideable).hide();

	$("form#links").dialog(this.addLinkHandlerFactory(this));

	$("button.add").click(function() {
		$("form#links").dialog("open");
	});

	$("button.remove").click(this, function(event) {
		var list = event.data;
		$.ajax({
			url: "/api/pages/" + list.pageName + "/links/" + list.selectedIndex,
			method: "DELETE",
			success: function( data ) {
				var selected = list.container.find("p")[list.selectedIndex];
				selected.remove();
				list.selectedIndex = null;
				$(list.hideable).hide();	
			}
		});
	});

	$("button.up").click(this, function(event) {
		event.data.moveSelected(-1);
	});

	$("button.down").click(this, function(event) {
		event.data.moveSelected(1);
	});

	console.log(this.container.find("p"))

	this.container.find("p").click(this, this.paragraphClickHandler);
}
