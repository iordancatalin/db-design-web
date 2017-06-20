var id = 2;
var zindex = 2;
var lineType = "solid";
var objDraw1 = null, objDraw2;
var elements = [];
var maxiMini = 10;
var workspaceWidth = 100, workspaceHeight = 100;
var lungime = 10, cost;
var numar;
var elementWidth, elementHeight;
var drag;
var color = "#42c5f4";
var liniaCurenta;

$(document)
		.ready(
				function() {
					wrapperWidth = 15 / 100 * $("#mainForm\\:wrapper").width();
					wrapperHeight = 15 / 100 * $("#mainForm\\:wrapper")
							.height();

					$("#mainForm\\:rect0").draggable({
						scrollSpeed : 10,
						containment : "#mainForm\\:workspace"
					}).mousedown(
							function(event) {
								objDraw1 = null;
								if (event.which === 1) {
									addClone($(this), "mainForm:rect",
											$("#mainForm\\:rectCont"));
								}
							});
					$("#mainForm\\:circle2").draggable({
						scrollSpeed : 10,
						containment : "document"
					}).mousedown(
							function(event) {
								objDraw1 = null;
								if (event.which === 1) {
									addClone($(this), "mainForm:circle",
											$("#mainForm\\:circleCont"));
								}
							});
					$("#mainForm\\:workspace")
							.droppable(
									{
										drop : function(event, ui) {
											if ($(ui.draggable)
													.hasClass("drop")) {
												switch (getIdName($(
														ui.draggable)
														.attr("id"))) {
												case "mainForm:rect":
													afterClickRectangle($(ui.draggable));
													break;
												case "mainForm:circle":
													afterClickCircle($(ui.draggable));
													break;
												}
											}
										}
									})
							.click(
									function(event) {
										if ($(event.target).attr("id") === "mainForm:workspace") {
											objDraw1 = null;
										}
									});
					$("#mainForm\\:wrapper, #mainForm\\:workspace")
							.mousedown(
									function(event) {
										if (event.button === 0) {
											if ($(event.target).attr("id") !== "mainForm:superColor") {
												$("#mainForm\\:superColor")
														.animate({
															height : "0"
														});
											}
										}
									});
					$("#mainForm\\:showButton").draggable({
						containment : "parent",
						axis : "x",
						drag : function(event, ui) {
							$("#mainForm\\:options").css({
								display : "block",
								width : $(event.target).offset().left
							});
						}
					});

					$(".log-in-style")
							.click(
									function(event) {
										if ($(event.target).attr("id") === "mainForm:container") {
											hideLogin();
										}
									});

					$("#mainForm\\:formPanel").click(
							function() {
								hideShow($("#mainForm\\:shapesCont"),
										$("#formsArrow"));
							});
					$("#mainForm\\:linePanel").click(
							function() {
								hideShow($("#mainForm\\:lineContainer"),
										$("#linesArrow"));
							});
					$("#mainForm\\:colorPanel").click(
							function() {
								hideShow($("#mainForm\\:colorCont"),
										$("#colorsArrow"));
							});

					$(".color-panel").click(function() {
						changeColor($(this));
					})
					$(".color-panel-super").click(function() {
						lineChangeColor($(this));
					})
					upToDown($("#mainForm\\:login"),
							$("#mainForm\\:container"),
							$("#mainForm\\:logPanel"));
				});

var hideLogin = function() {
	$(".log-in-panel").animate({
		top : "0"
	}, "", function() {
		$(".log-in-style").css("display", "none");
	});
	$("#mainForm\\:messagesArea").text("");
};

var changeColor = function(obiect) {
	var culori = obiect.attr("id").split(":");
	color = culori[1];
	if (color === "blueLight") {
		color = "#42c5f4";
	}
	$(".color-color").css("color", color);
	$(".color-back").css("backgroundColor", color);
	$(".color-border").css("borderColor", color);
	$(".loader").css("borderTopColor",color)
}

var lineChangeColor = function(obiect) {
	var culori = obiect.attr("id").toLowerCase().split(":");
	if (culori[1] === "bluelight") {
		$("." + liniaCurenta).css("borderColor", "#42c5f4");
	} else {
		$("." + liniaCurenta).css("borderColor", culori[1]);
	}
}

var upToDown = function(clickObject, containerObject, downObject) {
	clickObject.click(function() {
		containerObject.css("display", "block");
		downObject.animate({
			top : "25%"
		});
	});
};

var hideShow = function(element, idElement) {
	objDraw1 = null;
	element.slideToggle("fast", function() {
		if (element.css("display") !== "none") {
			idElement.removeClass("fa-arrow-down").addClass("fa-arrow-up");
		} else {
			idElement.removeClass("fa-arrow-up").addClass("fa-arrow-down");
		}
	});
};

var addClone = function(div, idNameCreate, $toAppend) {
	div.css({
		position : "absolute",
		zIndex : zindex
	});
	id++;
	var $divClone = div.clone();
	$divClone.draggable({
		scroll : true,
		scrollSpeed : 10,
		containment : "#mainForm\\:workspace"
	}).attr({
		"id" : idNameCreate + id
	}).mousedown(function(event) {
		if (event.which === 1) {
			objDraw1 = null;
			addClone($(this), idNameCreate, $toAppend);
		}
	});
	zindex++;
	appendElement($toAppend, $divClone);
};

function deletePress(obj, event) {
	if (event.which === 46) {
		if (typeof $(event.target).attr("id") === "undefined") {
			var clase = obj.attr("class").split(" ");
			var clasa = clase[clase.length - 1];

			var sLines = $(".line-style").toArray();
			for ( var linie in sLines) {
				var test = sLines[linie].className.split(" ");
				var lineId = test[test.length - 1];
				console.log(lineId, clasa);
				if (lineId === clasa) {
					sLines[linie].remove();
				}
			}
		} else {
			var id = getIdNumber($(event.target).attr("id"));
			console.log("Id-ul", id);
			deleteAllLines(id);
			obj.remove();
		}
		objDraw1 = null;
	}
}

var afterClickRectangle = function($div) {
	var $cll = $div.clone();
	var $left = event.clientX + $("#mainForm\\:wrapper").scrollLeft();
	var $top = event.clientY + $("#mainForm\\:wrapper").scrollTop();
	var $input = $("<input></input>");
	var $divDescriptionTransparent = $("<div> </div>");
	var $divTitleTransparent = $("<div> </div>");
	var $inputDescription = $("<textarea>Description...</textarea>");
	$input.attr({
		type : "text",
		id : "rectTitleInput" + (id - 1),
		value : "Title"
	}).blur(function() {
		$(this).css("zIndex", 1);
	});
	$inputDescription.attr({
		id : "rectDescriptionInput" + (id - 1)
	}).blur(function() {
		$(this).css("zIndex", 1);
	});
	$input.addClass("title-input-style").css("backgroundColor", color);
	$input.addClass("color-back");
	$inputDescription.addClass("description-input-style");
	$divTitleTransparent.addClass("transparent-title ").dblclick(function() {
		$input.css("zIndex", 5).select();
	});
	$divDescriptionTransparent.addClass("transparent-description ").dblclick(
			function() {
				$inputDescription.css("zIndex", 5).select();
			});
	$div.remove();
	$cll.pointsArray = [];
	$cll.draggable({
		scroll : true,
		scrollSpeed : 10,
		containment : "#mainForm\\:workspace",
		drag : function(event, ui) {
			reDraw(event);
		},
		stop : function(event, ui) {
			objDraw1 = $(event.target);
		}
	}).css({
		width : "200px",
		height : "120px",
		border : "1px solid " + color,
		outline : "none",
		margin : "0"
	}).mousedown(function() {
		$(this).css("zIndex", zindex);
		zindex++;
		$(this).focus();
		$(this).css("boxShadow", "2px 2px 10px black");
	}).mouseup(function() {
		if (!drag) {
			toCreateLine($cll);
		}
		drag = false;
	}).keyup(function(event) {
		deletePress($(this), event);
	}).attr("tabindex", 1).blur(function() {
		$(this).css("boxShadow", "none");
	}).removeClass("drop").addClass("color-border");
	appendElement($("#mainForm\\:workspace"), $cll);
	$left -= $cll.width() / 2;
	$top -= $cll.height() / 2;
	$cll.css({
		left : $left + "px",
		top : $top + "px"
	});
	appendElement($cll, $input);
	appendElement($cll, $inputDescription);
	appendElement($cll, $divDescriptionTransparent);
	appendElement($cll, $divTitleTransparent);
	elementPoints($cll);
	elements.push($cll);
	if (elementWidth === 0) {
		elementWidth = $cll.width();
	}
	if (elementHeight === 0) {
		elementHeight = $cll.height();
	}
};

var reDraw = function(event) {
	drag = true;
	for ( var elem in elements) {
		if (elements[elem].attr("id") === $(event.target).attr("id")) {
			elementPoints(elements[elem]);
			break;
		}
	}
	var sLines = $(".line-style").toArray();
	var lineToDraw = [];
	var thisId = getIdNumber($(event.target).attr("id"));
	for ( var linie in sLines) {
		var test = sLines[linie].className.split(" ");
		var lineId = getIdNumber(test[test.length - 1]);
		var ids = lineId.split("-");
		if (ids[0] === thisId) {
			sLines[linie].remove();
			if (!(find(ids[1], lineToDraw))) {
				lineToDraw.push(ids[1]);
			}
		} else if (ids[1] === thisId) {
			sLines[linie].remove();
			if (!find(ids[0], lineToDraw)) {
				lineToDraw.push(ids[0]);
			}
		}
	}

	for ( var line in lineToDraw) {
		drawLine(findDivByIdNumber(thisId), findDivByIdNumber(lineToDraw[line]));
	}

};

var find = function(idCautare, arrayCautare) {
	for ( var cauta in arrayCautare) {
		if (idCautare === arrayCautare[cauta]) {
			return true;
		}
	}
	return false;
}

var afterClickCircle = function($div) {
	var $cll = $div.clone();
	$div.remove();
	var $left = event.clientX + $("#mainForm\\:wrapper").scrollLeft();
	var $top = event.clientY + $("#mainForm\\:wrapper").scrollTop();
	var divWidth, divHeight;
	var $input = $("<textarea></textarea>");
	var $divTitleTransparent = $("<div> </div>");
	$input.attr({
		id : "circleTitleInput" + (id - 1)
	}).blur(function() {
		$(this).css({
			zIndex : 1,
			overflow : "hidden"
		});
	}).addClass("input-circle");
	$cll.pointsArray = [];
	$divTitleTransparent.addClass("transparent-title-circle").dblclick(
			function() {
				$input.css({
					zIndex : 5,
					overflow : "auto"
				}).select();
			});
	$cll.draggable({
		scroll : true,
		scrollSpeed : 10,
		containment : "#mainForm\\:workspace",
		drag : function(event, ui) {
			reDraw(event);
		},
		stop : function(event, ui) {
			objDraw1 = $(event.target);
		}
	}).css({
		width : "120px",
		height : "120px",
		outline : "none",
		boxShadow : "none",
		color : "white",
		backgroundColor : color
	}).mousedown(function() {
		$(this).css("zIndex", zindex);
		zindex++;
		$(this).focus();
		$(this).css("boxShadow", "2px 2px 10px black");
	}).mouseup(function() {
		if (!drag) {
			toCreateLine($cll);
		}
		drag = false;
	}).keyup(function(event) {
		deletePress($(this), event);
	}).attr("tabindex", 1).blur(function() {
		$(this).css("boxShadow", "none");
	}).removeClass("drop");
	appendElement($("#mainForm\\:workspace"), $cll);
	divWidth = $cll.width();
	divHeight = $cll.height();
	$left -= divWidth / 2;
	$top -= divHeight / 2;
	$cll.css({
		left : $left + "px",
		top : $top + "px"
	});
	appendElement($cll, $input);
	appendElement($cll, $divTitleTransparent);
	elementPoints($cll);
	elements.push($cll);
	if (elementWidth === 0) {
		elementWidth = $cll.width();
	}
	if (elementHeight === 0) {
		elementHeight = $cll.height();
	}
};

function appendElement($parent, $child) {
	$parent.append($child);
}

function createLine(point1, point2, idElement1, idElement2) {
	var x1, x2, y1, y2;
	if (point1.left < point2.left) {
		x1 = point1.left;
		x2 = point2.left;
		y1 = point1.top;
		y2 = point2.top;
	} else if (point1.left > point2.left) {
		x1 = point2.left;
		x2 = point1.left;
		y1 = point2.top;
		y2 = point1.top;
	} else if (point1.top < point2.top) {
		x1 = point1.left;
		x2 = point2.left;
		y1 = point1.top;
		y2 = point2.top;
	} else {
		x1 = point2.left;
		x2 = point1.left;
		y1 = point2.top;
		y2 = point1.top;
	}
	if (x1 === x2) {
		line = $("<div>").appendTo("#mainForm\\:workspace").css({
			position : "absolute",
			'borderRight' : '1px ' + lineType + " " + color,
			height : y2 - y1 + "px",
			width : "1"
		}).offset({
			left : x1,
			top : y1
		}).attr("tabIndex", "1").addClass("line-style").draggable({
			containment : "parent",
			axis : "x"
		});
	} else if (y1 === y2) {
		line = $("<div>").appendTo("#mainForm\\:workspace").css({
			position : "absolute",
			'borderTop' : '1px ' + lineType + " " + color,
			width : x2 - x1 + "px",
			height : "1"
		}).offset({
			left : x1,
			top : y1
		}).attr("tabIndex", "1").addClass("line-style").draggable({
			containment : "parent",
			axis : "y"
		});
	}
	line.keyup(function(event) {
		deletePress($(this), event);
	}).addClass("color-border").addClass(
			"line_" + idElement1 + "-" + idElement2).contextmenu(
			function(event) {
				var linii =  $(this).attr("class").split(" ");
				liniaCurenta = linii[linii.length-1];
				var $left = event.clientX
						+ $("#mainForm\\:wrapper").scrollLeft() + 5;
				var $top = event.clientY + $("#mainForm\\:wrapper").scrollTop()
						+ 5;
				$("#mainForm\\:superColor").css({
					left : $left + "px",
					top : $top + "px",
					height : "0",
					display : "block"
				}).animate({
					height : "10%",
				});
				return false;
			});
	return line;
}

var toCreateLine = function($obj) {
	if (objDraw1 === null) {
		objDraw1 = $obj;
	} else {
		if ($obj.attr("id") === objDraw1.attr("id")) {
			return;
		}
		objDraw2 = $obj;
		var idObj1 = getIdNumber(objDraw1.attr("id"));
		var idObj2 = getIdNumber(objDraw2.attr("id"));

		var sLines = $(".line-style").toArray();
		for ( var linie in sLines) {
			if (findClass(sLines[linie], idObj1, idObj2)) {
				return;
			}
		}
		drawLine(objDraw1, objDraw2);
		objDraw1 = objDraw2;
		objDraw2 = null;
	}
};

var findClass = function(linie, id1, id2) {
	var clase = linie.className.split(" ");
	var clasa = clase[clase.length - 1];
	if (clasa === "line_" + id1 + "-" + id2) {
		return true;
	}
	if (clasa === "line." + id2 + "-" + id1) {
		return true;
	}
	return false;
};

function drawLine(objDraw1, objDraw2) {
	setPoints(objDraw1);
	setPoints(objDraw2);

	if (objDraw1.offset().top > objDraw2.offset(top)) {
		var aux = objDraw1;
		objDraw1 = objDraw2;
		objDraw2 = aux;
	}

	var costMinim = 1000000000;
	var puncte;
	var lengthMinim = 1000;
	var ii, jj;
	var ip = new Object();
	var fp = new Object();
	for (var i = 0; i < objDraw1.pointsArray.length; i++) {

		for (var j = 0; j < objDraw2.pointsArray.length; j++) {

			cost = 0;
			var points = [];
			numar = 0;
			getPoints(objDraw1.pointsArray[i], objDraw2.pointsArray[j],
					objDraw1, "horizontal", points);
			if (points.length < lengthMinim) {
				lengthMinim = points.length;
				puncte = points;
				ii = i;
				jj = j;
			} else if (points.length === lengthMinim) {
				if (cost < costMinim) {
					costMinim = cost;
					puncte = points;
					ii = i;
					jj = j;
				}
			}
			numar = 0;
			cost = 0;
			points = [];
			getPoints(objDraw1.pointsArray[i], objDraw2.pointsArray[j],
					objDraw1, "vertical", points);
			if (points.length < lengthMinim) {
				lengthMinim = points.length;
				puncte = points;
				ii = i;
				jj = j;
			} else if (points.length === lengthMinim) {
				if (cost < costMinim) {
					costMinim = cost;
					puncte = points;
					ii = i;
					jj = j;
				}
			}
		}
	}
	var point = new Object();
	point.left = objDraw1.pointsArray[ii].leftOriginal;
	point.top = objDraw1.pointsArray[ii].topOriginal;
	puncte.unshift(point);
	var pointf = new Object();
	pointf.left = objDraw2.pointsArray[jj].leftOriginal;
	pointf.top = objDraw2.pointsArray[jj].topOriginal;
	puncte.push(pointf);

	formats(puncte);

	for (var i = 0; i < puncte.length - 1; i++) {
		createLine(puncte[i], puncte[i + 1], getIdNumber(objDraw1.attr("id")),
				getIdNumber(objDraw2.attr("id")));
	}
}

var formats = function(points) {

	for (var index = 0; index < points.length - 1; index++) {
		if (Math.abs(points[index].left - points[index + 1].left) < 2) {
			points[index + 1].left = points[index].left;
		} else if (Math.abs(points[index].top - points[index + 1].top) < 2) {
			points[index + 1].top = points[index].top;
		}
	}

	if (points.length >= 3) {

		if (points[1].left === points[2].left
				&& points[1].left === points[0].left) {
			points[1].top = points[0].top;
			points.shift();
		} else if (points[1].top === points[2].top
				&& points[1].top === points[0].top) {
			points[1].left = points[0].left;
			points.shift();
		}

		if (points[points.length - 3].left === points[points.length - 2].left
				&& points[points.length - 2].left === points[points.length - 1].left) {
			points[points.length - 2].top = points[points.length - 1].top;
			points.pop();
		} else if (points[points.length - 3].top === points[points.length - 2].top
				&& points[points.length - 2].top === points[points.length - 1].top) {
			points[points.length - 2].left = points[points.length - 1].left;
			points.pop();
		}
	}
}

var setPoints = function(obiect) {
	obiect.pointsArray = [];
	obiect.pointsArray.push({
		left : obiect.offset().left - lungime,
		top : obiect.offset().top + obiect.height() / 2,
		leftOriginal : obiect.offset().left,
		topOriginal : obiect.offset().top + obiect.height() / 2
	}, {
		left : obiect.offset().left + obiect.width() / 2,
		top : obiect.offset().top - lungime,
		leftOriginal : obiect.offset().left + obiect.width() / 2,
		topOriginal : obiect.offset().top,
	}, {
		left : obiect.offset().left + obiect.width() / 2,
		top : obiect.offset().top + obiect.height() + lungime,
		leftOriginal : obiect.offset().left + obiect.width() / 2,
		topOriginal : obiect.offset().top + obiect.height(),
	}, {
		left : obiect.offset().left + obiect.width() + lungime,
		top : obiect.offset().top + obiect.height() / 2,
		leftOriginal : obiect.offset().left + obiect.width(),
		topOriginal : obiect.offset().top + obiect.height() / 2
	});
};

var getIdNumber = function(fullId) {
	var i;
	for (i = 0; i <= fullId.length; i++) {
		if (fullId.charAt(i) >= '0' && fullId.charAt(i) <= '9') {
			break;
		}
	}
	return fullId.substring(i, fullId.length);
};

var findDivByIdNumber = function(searchId) {
	for (var i = 0; i < elements.length; i++) {
		if (getIdNumber(elements[i].attr("id")) == searchId) {
			return elements[i];
		}
	}
};

var getIdName = function(fullId) {
	var i;
	for (i = 0; i <= fullId.length; i++) {
		if (fullId.charAt(i) >= '0' && fullId.charAt(i) <= '9') {
			break;
		}
	}
	return fullId.substring(0, i);
};

function getPoints(initialPoint, finalPoint, element, type, points) {
	var nextPoint = new Object();
	var calculLeft, calculTop;
	points.push(initialPoint);
	calculLeft = Math.abs(initialPoint.left - finalPoint.left);
	calculTop = Math.abs(initialPoint.top - finalPoint.top);
	if ((calculLeft < 3 && calculTop < 3) || numar >= 100) {
		return;
	}

	if (type == "horizontal") {
		if (initialPoint.left === finalPoint.left) {
			nextPoint.top = initialPoint.top;
			nextPoint.left = initialPoint.left + element.width();
		} else {
			nextPoint.left = finalPoint.left;
			nextPoint.top = initialPoint.top;
			nextPoint = verifyLine(initialPoint, nextPoint);
		}
		numar++;
		cost += Math.abs(initialPoint.left - nextPoint.left);
		getPoints(nextPoint, finalPoint, element, "vertical", points);

	} else if (type == "vertical") {
		if (initialPoint.top === finalPoint.top) {
			nextPoint.top = initialPoint.top + element.height();
			nextPoint.left = initialPoint.left;
		} else {
			nextPoint.top = finalPoint.top;
			nextPoint.left = initialPoint.left;
			nextPoint = verifyLine(initialPoint, nextPoint);
		}
		numar++;
		cost += Math.abs(initialPoint.top - nextPoint.top);
		getPoints(nextPoint, finalPoint, element, "horizontal", points);
	}
}

var verifyLine = function(initialPoint, finalPoint) {
	var distanta;
	var distantaElement;
	var distantaMinima = 1000000;
	var diferenta = 7;
	var result = new Object();

	if (initialPoint.top === finalPoint.top) {
		diferenta += elementWidth / 2;
		for ( var elem in elements) {
			if (inside(initialPoint, finalPoint, elements[elem])) {
				distantaElement = Math.abs(elements[elem].leftCenter
						- initialPoint.left);
				if (distantaElement < distantaMinima) {
					distantaMinima = distantaElement;
					element = elements[elem];
				}
			}
		}
		if (distantaMinima !== 1000000) {
			if (initialPoint.left < finalPoint.left) {
				result.left = initialPoint.left + distantaMinima - diferenta;
			} else {
				result.left = initialPoint.left - distantaMinima + diferenta;
			}
			result.top = initialPoint.top;
			return result;
		}

	} else if (initialPoint.left === finalPoint.left) {
		diferenta += elementHeight / 2;
		for ( var elem in elements) {
			if (inside(initialPoint, finalPoint, elements[elem])) {
				distantaElement = Math.abs(elements[elem].topCenter
						- initialPoint.top);
				if (distantaElement < distantaMinima) {
					distantaMinima = distantaElement;
					element = elements[elem];
				}
			}
		}
		if (distantaMinima !== 1000000) {
			if (initialPoint.top < finalPoint.top) {
				result.top = initialPoint.top + distantaMinima - diferenta;
			} else {
				result.top = initialPoint.top - distantaMinima + diferenta;
			}
			result.left = initialPoint.left;
			return result;
		}
	}
	return finalPoint;
};

var inside = function(initial, final, element) {
	var minLeft = initial.left > final.left ? final.left : initial.left;
	var maxLeft = initial.left > final.left ? initial.left : final.left;
	var minTop = initial.top > final.top ? final.top : initial.top;
	var maxTop = initial.top > final.top ? initial.top : final.top;

	if (initial.top === final.top) {
		if (element.leftTop.top <= initial.top
				&& element.leftBottom.top >= initial.top) {
			if ((element.leftTop.left >= minLeft && element.leftTop.left <= maxLeft)
					|| (element.rightTop.left >= minLeft && element.rightTop.left <= maxLeft)) {
				return true;
			}
		}
	} else if (initial.left === final.left) {
		if (element.leftTop.left <= initial.left
				&& element.rightTop.left >= initial.left) {
			if ((element.leftTop.top >= minTop && element.leftTop.top <= maxTop)
					|| (element.leftBottom.top >= minTop && element.leftBottom.top <= maxTop)) {
				return true;
			}
		}
	}
	return false;
}

var elementPoints = function(element) {
	element.leftTop = $(element).offset();
	element.leftBottom = $(element).offset();
	element.leftBottom.top += $(element).height();
	element.rightTop = $(element).offset();
	element.rightTop.left += $(element).width();
	element.rightBottom = $(element).offset();
	element.rightBottom.top += $(element).height();
	element.rightBottom.left += $(element).width();
	element.leftCenter = $(element).offset().left + $(element).width() / 2;
	element.topCenter = $(element).offset().top + $(element).height() / 2;
};

var login = function() {
	$(".log-in-style").css("display", "block");
	$(".log-in-panel").animate({
		top : "30%"
	}, "");
};

var minimize = function() {
	if (workspaceWidth > 100) {
		workspaceWidth -= maxiMini;
		workspaceHeight -= maxiMini;
		$("#mainForm\\:workspace").css({
			width : workspaceWidth + "%",
			height : workspaceHeight + "%"
		});
	}
};

var maximize = function() {
	workspaceWidth += maxiMini;
	workspaceHeight += maxiMini;
	$("#mainForm\\:workspace").css({
		width : workspaceWidth + "%",
		height : workspaceHeight + "%"
	});
};

var original = function() {
	workspaceWidth = 100;
	workspaceHeight = 100;
	$("#mainForm\\:workspace").css({
		width : "100%",
		height : "100%"
	});
};

var view = function() {
	$(".view").fadeToggle();
};

var deleteAllLines = function(id) {
	var sLines = $(".line-style").toArray();
	for ( var linie in sLines) {
		var test = sLines[linie].className.split(" ");
		var lineId = getIdNumber(test[test.length - 1]);
		var ids = lineId.split("-");
		if (ids[0] === id || ids[1] === id) {
			sLines[linie].remove();
		}
	}
};

var displayLoader = function() {
	$("#mainForm\\:loader").css("display", "block");
};

var ajaxExec = function(data) {
	if (data.status == "success") {
		$("#mainForm\\:loader").css("display", "none");
		if ($("#mainForm\\:raspuns").attr("value") === "success") {
			hideLogin();
		}
	}
};