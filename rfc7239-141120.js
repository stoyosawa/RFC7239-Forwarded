/* Add Forwarded header (RFC 7239)
 * 2014-11-20: ST
 */
var vsm = require('lrs/virtualServerModule');
var vs_name = 'vs1';
var services = {
    80: 'http',
    8080: 'http',
    443: 'https'
};

var toQuotedIPv6Addr = function(addr, family) {
    if (/ipv6/i.test(family)) {
	    addr = '[' + addr + ']';
    }
    return(addr)
}

var procReq = function(servReq, servResp, cliReq) {
    var addr_family = servReq.connection.address()['family'].toLowerCase();
    var proto = services[servReq.connection.address()['port']];
    var proxy_ip = toQuotedIPv6Addr(servReq.connection.address()['address'],
				    addr_family);
    var proxy_port = servReq.connection.address()['port'];
    var client_ip = toQuotedIPv6Addr(servReq.connection.remoteAddress,
				     addr_family);
    var client_port = servReq.connection.remotePort;

    var forwarded =
	'for="' + client_ip + ':' + client_port + '";' +
	'by="' + proxy_ip + ':' + proxy_port + '";' +
	'host=' + servReq.headers['Host'];
    if (typeof(proto) !== 'undefined') {
	    forwarded += ';proto=' + proto.toLowerCase();
    }
    console.log("Forwarded: " + forwarded);
    servReq.addHeader('Forwarded', forwarded);

    cliReq();
};

var callback = function(vso) {
    console.log("vs " + vso.id + " exists");
    vso.on('request', procReq);
};

vsm.on('exist', vs_name, callback);
