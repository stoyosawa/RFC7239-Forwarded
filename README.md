RFC7239-Forwarded
=================
Injecting Forwarded header to the client requrest.

TODO:
1) Handle multiple hops. Currently, it assumes this instanace as the only proxy between a client and a real server. It does not cocatenate multiple values with ",".
2) Handle IPv6 addresses elegantly.
