( function stric() {
	'use strict';
	// ********** Definitions ***************************
	// A line is defined by to points as ( x, y ) pairs;
	// A point is a single ( x, y ) pair
	// **************************************************

	// dist: retorna la distancia entre cada extremos de un segmento (line) y un punto (point)
	var distLinePoint = function( line, point ) {
		var i, j,
			dist = [];
		for ( i = 0; i < line.length; i++ ) {
			var disTemp = 0;
			for ( j = 0; j < line[ i ].length; j++ ){
				disTemp += Math.pow( ( line[ i ][ j ] - point[ j ] ), 2 );
			}
			dist.push( [ Math.sqrt( disTemp ), line[i] ] );
		}
		return dist;
	};

	//calcula si un punto (point) de recta pertenece al segmento definido por line,
	// y si se encuentra a menos de un delta de los extremos
	var belong = function( line, point, delta ) {
		//verifico si el punto está contenido en el segemento line
		var deltaPrima = distLinePoint( line, line[ 1 ] )[ 0 ][ 0 ];
		var distEdge = distLinePoint( line, point, deltaPrima );
		if ( distEdge[ 0 ][ 0 ] > deltaPrima ||
			distEdge[ 1 ][ 0 ] > deltaPrima ) {
			return false;
		}

		// Verifico si está a menos de un delta de los puntos extremos
		var distDelta = distLinePoint( line, point, delta );
		if ( distDelta[ 0 ][ 0 ] > delta &&
			distDelta[ 1 ][ 0 ] > delta ) {
			return false;
		}
		// Si las dos distancias son menores que delta, retorna la menor
		if ( distDelta[ 0 ][ 0 ] < distDelta[ 1 ][ 0 ] ) {
			return distDelta[ 0 ];
		} else {
			return distDelta[ 1 ];
		}
	};

	// findLine: encuentra si un punto está contenido en una línea
	var findLine = function( line, point, delta ) {
		var	x1 = line[0][0],
			y1 = line[0][1],
			x2 = line[1][0],
			y2 = line[1][1],
			a1 = point[0],
			a2 = point[1];

		// m: pendiente
		var m = ( y2 - y1 ) / ( x2 - x1 );
		// b: Ordenada de origen
		var b = y2 - ( m * x2 );
		if ( a2 !== ( m * a1 ) + b ) return false;
		var dist1 = belong( line, point, delta );
		if ( !dist1 ) return false;
		return dist1;
	};

	var splitPoliline = function( breakPoint, poliline ) {
		var i,
		splitedPolilines = [];
		for ( i = 0; i < breakPoint.length; i++) {
			var index = poliline.indexOf( breakPoint[i][0] );
			var startSplit = poliline.slice( 0, index + 1);
			startSplit.push(breakPoint[i][1]);
			var endSplit = poliline.slice(index+1);
			endSplit.unshift(breakPoint[i][1]);
			splitedPolilines.push(endSplit);
			splitedPolilines.unshift(startSplit);
			splitedPolilines.push(breakPoint[i][1]);
		}
		return splitedPolilines;
	};

	// analizePoliline: Analiza si un punto es contenido en una polilinea
	var analizePoliline = function( poliline, points, delta ) {
		var i, j, breakPoint = [];
		for ( i = 0; i < poliline.length - 1; i++ ) {
			var line = [ poliline[ i ], poliline[ i + 1 ] ];
			for ( j = 0; j < points.length; j++ ) {
				var found = findLine( line, points[ j ], delta );
				if ( found ) {
					// console.log( { nearestPoint: found, line: line, point: points[ j ] } );
					breakPoint.push( [ line[0], points[ j ] ] );
					return splitPoliline(breakPoint, poliline);
				}
			}
		}
		return false;
	};

	var foundPoliline = function( poliLines, points, delta ) {
		var i,
			results = [];
		for ( i = 0; i < poliLines.length; i++ ) {
			var poliline = poliLines[i].points;
			var found = analizePoliline( poliline, points, delta );
			if (found) {
				results.push({
					name : poliLines[i].name,
					orginalState: poliLines[i].points,
					splitingPoint: found[2],
					split1: found[0],
					split2: found[1]
				});
			}
		}
		if (results.length > 0) {
			for (var j = 0; j < results.length; j++){
			console.log('Poliline:', results[j].name);
			console.log('OrginalState', results[j].orginalState);
			console.log('Spliting Point:', results[j].splitingPoint);
			console.log('splitedState: First Part', results[j].split1);
			console.log('splitedState: Second Part', results[j].split2);
			}
		} else {
			console.log('No matches between poli lines and points');
		}
	};

	// *********** Sample lines: *********************************
	var l1 = [ [1, 1], [ 4, 4 ] ];

	// ********** Sample points: **********************************
	var points = [ [ 1.5, 1.5 ], [ 7, 2 ] ];

	// ********** Sample poli line *********************************
	var poli1 = [ [ 1,1 ], [ 2, 2 ], [ 0, 1 ], [ 1, 4 ] ];
	var poli2 = [ [ 1,7 ], [ 2, 3 ], [ 0, 2 ], [ 1, 4 ], [ -1, -1 ], [ 2, 2 ] ];

 // *********** Sample poliLines *********************************
	var poliLines1 = [
		{
			name: 'poli1',
			points: poli1
		},
		{
			name: 'poli2',
			points: poli2
		}
	];

	// ********** Run program **************************************
	foundPoliline ( poliLines1, points, 8 );
} )();
