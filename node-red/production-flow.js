[{"type":"tab","id":"5d7c6aac.810264","label":"Serial to MQTT & DB"},{"type":"tab","id":"7a69b8ae.02f248","label":"Alerts from house"},{"type":"tab","id":"bef50b75.d162a","label":"Switch off appliances"},{"id":"3d5e337a.5a9084","type":"MySQLdatabase","host":"127.0.0.1","port":"3306","db":"mydata"},{"id":"6ae3bdcd.ab16bc","type":"mqtt-broker","broker":"localhost","port":"1883","clientid":""},{"id":"8019c7f2.618c78","type":"serial-port","serialport":"/dev/ttyUSBRFM","serialbaud":"57600","newline":"\\n","addchar":"false"},{"id":"fc5973ef.a12d38","type":"serial-port","serialport":"/dev/ttyUSBCC","serialbaud":"9600","newline":"\\r","addchar":"false"},{"id":"72bd61c1.c2afa","type":"mysql","mydb":"3d5e337a.5a9084","name":"mydata","x":582,"y":405,"z":"5d7c6aac.810264","wires":[["7bb0e53a.9510ec"]]},{"id":"9202d80a.014398","type":"serial in","name":"RFMHubReceiver","serial":"8019c7f2.618c78","x":131,"y":108,"z":"5d7c6aac.810264","wires":[["a7b33488.d54ad","4f75be59.8cfa6"]]},{"id":"a7b33488.d54ad","type":"function","name":"ParseInfoMessages","func":"if (msg.payload.indexOf(\"INFO\") >= 0) {\n\tmsg.payload = \"NR: \" + msg.payload;\n} else {\n\tmsg = null;\n}\n\nreturn msg;","outputs":1,"x":363,"y":118,"z":"5d7c6aac.810264","wires":[["69a25cdd.0c093c"]]},{"id":"69a25cdd.0c093c","type":"debug","name":"","active":true,"console":"false","complete":"false","x":545,"y":119,"z":"5d7c6aac.810264","wires":[]},{"id":"4f75be59.8cfa6","type":"function","name":"ParseDataMessages","func":"var messages = [];\n\n// Determine which wireless node is publishing - each one publishes slightly different\n// data so this allows us to process each one individually\nif (msg.payload.indexOf(\"DATA\") >= 0) {\n    var wirelessNodeNumber = \"\" + msg.payload.substring(msg.payload.indexOf(\"Nd\") + 2, msg.payload.indexOf(\"Nd\") + 5);\n    \n    // Strip off leading 0 i.e. Nd03 becomes just 3, Nd11 becomes 11\n    if (wirelessNodeNumber.indexOf(\"0\") == 0) {\n    \twirelessNodeNumber = wirelessNodeNumber.substring(1, wirelessNodeNumber.length);\n    }\n    \n    messages[0] = { payload: msg.payload, topic: \"\" + wirelessNodeNumber };\n}\n\nreturn messages;","outputs":1,"x":351,"y":177,"z":"5d7c6aac.810264","wires":[["87245b5e.3e3dc8"]]},{"id":"25bd8cd3.c9bb4c","type":"debug","name":"","active":true,"console":"false","complete":"false","x":1276,"y":175,"z":"5d7c6aac.810264","wires":[]},{"id":"22caa738.cde588","type":"inject","name":"Test loft node","topic":"","payload":"DATA: GROUP(53) HEADER(97) BYTES(15) Nd02 9 56 16 33","payloadType":"string","repeat":"","crontab":"","once":false,"x":130,"y":163,"z":"5d7c6aac.810264","wires":[["4f75be59.8cfa6"]]},{"id":"952463cb.4d5638","type":"function","name":"Parse loft node data","func":"// Node 2 - loft node\nvar messages = [];\n\nmessages[0] = [];\n\nvar tokens = msg.payload.split(\" \");\n\n// Current time & date\nvar dateStamp = \"\" + new Date();\ndateStamp = dateStamp.substring(dateStamp.indexOf(\" \") + 1, dateStamp.indexOf(\"GMT\"));\n\n// Get each of the individual elements from the data\nif (tokens.length > 0) {\n\tmessages[0][0] = { payload: \"\" + tokens[6], topic: \"local/rfm12/nodes/02/humidity\", retain: true };\n\tmessages[0][1] = { payload: \"\" + tokens[7], topic: \"local/rfm12/nodes/02/temp\", retain: true };\n\tmessages[0][2] = { payload: \"\" + tokens[8], topic: \"local/rfm12/nodes/02/voltage\", retain: true };\n\tmessages[0][3] = { payload: dateStamp, topic: \"local/rfm12/nodes/02/lastreceived\", retain: true };\n}\n\nreturn messages;","outputs":1,"x":1026,"y":122,"z":"5d7c6aac.810264","wires":[["25bd8cd3.c9bb4c","ebba594e.f81628"]]},{"id":"87245b5e.3e3dc8","type":"switch","name":"RouteWirelessNodeData","property":"topic","rules":[{"t":"eq","v":2,"v2":0},{"t":"eq","v":3,"v2":0},{"t":"eq","v":4,"v2":0}],"checkall":"false","outputs":3,"x":571,"y":179,"z":"5d7c6aac.810264","wires":[["45cf94c7.5b0954"],["ef79d576.5111f"],["37b4bac2.ab7246"]]},{"id":"71f47e41.b20d78","type":"function","name":"Parse lounge node data","func":"// Node 3 - lounge node\nvar messages = [];\nmessages[0] = [];\n\nvar tokens = msg.payload.split(\" \");\n\n// Current time & date\nvar dateStamp = \"\" + new Date();\ndateStamp = dateStamp.substring(dateStamp.indexOf(\" \") + 1, dateStamp.indexOf(\"GMT\"));\n\n// Get each of the individual elements from the data\nif (tokens.length > 0) {\n\tmessages[0][0] = { payload: \"\" + tokens[6], topic: \"local/rfm12/nodes/03/humidity\", retain: true };\n\tmessages[0][1] = { payload: \"\" + tokens[7], topic: \"local/rfm12/nodes/03/temp\", retain: true };\n\tmessages[0][2] = { payload: \"\" + tokens[8], topic: \"local/rfm12/nodes/03/voltage\", retain: true };\n\tmessages[0][3] = { payload: dateStamp, topic: \"local/rfm12/nodes/03/lastreceived\", retain: true };\n}\n\nreturn messages;","outputs":1,"x":1032,"y":174,"z":"5d7c6aac.810264","wires":[["25bd8cd3.c9bb4c","ebba594e.f81628"]]},{"id":"45cf94c7.5b0954","type":"delay","name":"","pauseType":"rate","timeout":"5","timeoutUnits":"seconds","rate":"1","rateUnits":"minute","randomFirst":"1","randomLast":"5","randomUnits":"seconds","drop":true,"x":823,"y":127,"z":"5d7c6aac.810264","wires":[["952463cb.4d5638"]]},{"id":"ef79d576.5111f","type":"delay","name":"","pauseType":"rate","timeout":"5","timeoutUnits":"minutes","rate":"1","rateUnits":"minute","randomFirst":"1","randomLast":"5","randomUnits":"seconds","drop":true,"x":831,"y":176,"z":"5d7c6aac.810264","wires":[["71f47e41.b20d78"]]},{"id":"37b4bac2.ab7246","type":"delay","name":"","pauseType":"rate","timeout":"5","timeoutUnits":"seconds","rate":"1","rateUnits":"minute","randomFirst":"1","randomLast":"5","randomUnits":"seconds","drop":true,"x":825,"y":232,"z":"5d7c6aac.810264","wires":[["51f96d11.f9309c"]]},{"id":"51f96d11.f9309c","type":"function","name":"Parse garden node data","func":"// Node 4 - garden node\nvar messages = [];\n\nmessages[0] = [];\n\nvar tokens = msg.payload.split(\" \");\n\n// Current time & date\nvar dateStamp = \"\" + new Date();\ndateStamp = dateStamp.substring(dateStamp.indexOf(\" \") + 1, dateStamp.indexOf(\"GMT\"));\n\n// Get each of the individual elements from the data\nif (tokens.length > 0) {\n\tmessages[0][0] = { payload: \"\" + tokens[5], topic: \"local/rfm12/nodes/04/moisture\", retain: true };\n\tmessages[0][1] = { payload: \"\" + tokens[6], topic: \"local/rfm12/nodes/04/voltage\", retain: true };\n\tmessages[0][2] = { payload: dateStamp, topic: \"local/rfm12/nodes/04/lastreceived\", retain: true };\n}\n\nreturn messages;","outputs":1,"x":1032,"y":234,"z":"5d7c6aac.810264","wires":[["25bd8cd3.c9bb4c","ebba594e.f81628"]]},{"id":"86887e.e46c5f8","type":"inject","name":"Test lounge node","topic":"","payload":"DATA: GROUP(53) HEADER(97) BYTES(15) Nd03 9 52 19 36","payloadType":"string","repeat":"","crontab":"","once":false,"x":143,"y":198,"z":"5d7c6aac.810264","wires":[["4f75be59.8cfa6"]]},{"id":"2ba453c5.c5c544","type":"inject","name":"Test garden node","topic":"","payload":"DATA: GROUP(53) HEADER(97) BYTES(15) Nd04 56 37","payloadType":"string","repeat":"","crontab":"","once":false,"x":143,"y":233,"z":"5d7c6aac.810264","wires":[["4f75be59.8cfa6"]]},{"id":"ebba594e.f81628","type":"mqtt out","name":"Publish all RFM12 data","topic":"","broker":"6ae3bdcd.ab16bc","x":1325,"y":226,"z":"5d7c6aac.810264","wires":[]},{"id":"27280dfb.49bc12","type":"mqtt in","name":"SubscribeRFM12Data","topic":"local/rfm12/#","broker":"6ae3bdcd.ab16bc","x":134,"y":405,"z":"5d7c6aac.810264","wires":[["748001a.0fc768"]]},{"id":"748001a.0fc768","type":"function","name":"MapMQTTtoMySQL","func":"// Simple switch-ish statement to turn an MQTT topic into an SQL statement\nif (!msg.retain) {\n\tif (msg.topic.valueOf() == \"local/rfm12/nodes/02/voltage\".valueOf()) {\n\t\tmsg.topic = \"INSERT INTO mydata.wirelessnodes(nodeid, voltage) values(2, \" + msg.payload + \")\";\n\t} else if (msg.topic.valueOf() == \"local/rfm12/nodes/03/voltage\".valueOf()) {\n\t\tmsg.topic = \"INSERT INTO mydata.wirelessnodes(nodeid, voltage) values(3, \" + msg.payload + \")\";\n\t} else if (msg.topic.valueOf() == \"local/rfm12/nodes/04/voltage\".valueOf()) {\n\t\tmsg.topic = \"INSERT INTO mydata.wirelessnodes(nodeid, voltage) values(4, \" + msg.payload + \")\";\n\t} else if (msg.topic.valueOf() == \"local/rfm12/nodes/02/temp\".valueOf()) {\n\t\tmsg.topic = \"INSERT INTO mydata.temperature2(temperature) values(\" + msg.payload + \")\";\n\t} else if (msg.topic.valueOf() == \"local/rfm12/nodes/02/humidity\".valueOf()) {\n\t\tmsg.topic = \"INSERT INTO mydata.humidity2(humidity) values(\" + msg.payload + \")\";\n\t} else if (msg.topic.valueOf() == \"local/rfm12/nodes/03/temp\".valueOf()) {\n\t\tmsg.topic = \"INSERT INTO mydata.temperature3(temperature) values(\" + msg.payload + \")\";\n\t} else if (msg.topic.valueOf() == \"local/rfm12/nodes/03/humidity\".valueOf()) {\n\t\tmsg.topic = \"INSERT INTO mydata.humidity3(humidity) values(\" + msg.payload + \")\";\n\t} else if (msg.topic.valueOf() == \"local/rfm12/nodes/04/moisture\".valueOf()) {\n\t\tmsg.topic = \"INSERT INTO mydata.moisture(moisture) values(\" + msg.payload + \")\";\n\t} else {\n\t\tmsg = null;\n\t}\n} else {\n\tmsg = null;\n}\n\nreturn msg;","outputs":1,"x":378,"y":405,"z":"5d7c6aac.810264","wires":[["72bd61c1.c2afa","be2aca09.42451"]]},{"id":"7bb0e53a.9510ec","type":"debug","name":"","active":false,"console":false,"complete":false,"x":747,"y":407,"z":"5d7c6aac.810264","wires":[]},{"id":"be2aca09.42451","type":"debug","name":"","active":false,"console":false,"complete":false,"x":573,"y":461,"z":"5d7c6aac.810264","wires":[]},{"id":"447d1f37.7d672","type":"mqtt in","name":"BBSB Command Receiver","topic":"local/rfm12/command","broker":"6ae3bdcd.ab16bc","x":135,"y":624,"z":"5d7c6aac.810264","wires":[["a8290f87.7ffb48","3cc1ffa4.e2f2d"]]},{"id":"a8290f87.7ffb48","type":"debug","name":"","active":false,"console":false,"complete":false,"x":378,"y":669,"z":"5d7c6aac.810264","wires":[]},{"id":"3cc1ffa4.e2f2d","type":"serial out","name":"Handle BBSB command","serial":"8019c7f2.618c78","x":587,"y":626,"z":"5d7c6aac.810264","wires":[]},{"id":"92ab7f.33f3348","type":"comment","name":"Receive serial data from an Arduino with an RFM12B chip, publish the relevant parts to various MQTT topics","info":"","x":395,"y":60,"z":"5d7c6aac.810264","wires":[]},{"id":"9f8d1180.7b3878","type":"comment","name":"Subscribe to the various MQTT topics that contain data from RFM12B wireless nodes, and put the right bits into a MySQL database","info":"","x":468,"y":349,"z":"5d7c6aac.810264","wires":[]},{"id":"7df659ae.a3983","type":"comment","name":"Subscribe to 'local/rfm12/command' and pass the command to an Arduino with an RFM12B chip to send it to the BBSB sockets in the house","info":"RFM12B chip to send it to the BBSB sockets in the house","x":498,"y":570,"z":"5d7c6aac.810264","wires":[]},{"id":"71754199.15aaf","type":"serial in","name":"CurrentCost Receiver","serial":"fc5973ef.a12d38","x":128,"y":824,"z":"5d7c6aac.810264","wires":[["fe326677.50921","b41cc285.ead218"]]},{"id":"b41cc285.ead218","type":"xml2js","name":"","x":315.99993896484375,"y":823.9999389648438,"z":"5d7c6aac.810264","wires":[["ee5f547d.c07e08","3dcf3f37.0f4ff8"]]},{"id":"3dcf3f37.0f4ff8","type":"function","name":"CurrentCost Watts","func":"\nvar result = msg.payload;\nmsg.topic=\"electricity\";\nmsg.payload = (result.msg.ch1[0].watts[0])*1;\n\nreturn msg;","outputs":1,"x":512,"y":829.9999389648438,"z":"5d7c6aac.810264","wires":[["dc4d8cd5.0364d8"]]},{"id":"ee5f547d.c07e08","type":"function","name":"CurrentCost Temp","func":"\nvar result = msg.payload;\nmsg.topic=\"cc-temperature\";\nmsg.payload = (result.msg.tmpr[0])*1;\n\nreturn msg;","outputs":1,"x":513,"y":869,"z":"5d7c6aac.810264","wires":[["1e6f937e.416065"]]},{"id":"fe326677.50921","type":"debug","name":"","active":false,"console":"false","complete":"false","x":318,"y":913,"z":"5d7c6aac.810264","wires":[]},{"id":"dc4d8cd5.0364d8","type":"function","name":"Round to 10 watts, publish on local and bridged topic","func":"context.lastvalue = context.lastvalue || 0.0;\n\nvar roundedWatts = Math.round(msg.payload / 10) * 10;\nroundedWatts = roundedWatts / 1000;\nvar messages = [];\nmessages[0] = [];\n\nif (context.lastvalue != roundedWatts) {\n\tmessages[0][0] = { payload: \"\" + roundedWatts, topic: \"local/PowerMeter/CC/mattw\", retain: true };\n\tmessages[0][1] = { payload: \"\" + roundedWatts, topic: \"PowerMeter/CC/mattw\", retain: true };\n\tcontext.lastvalue = roundedWatts;\n} else {\n\tmsg = null;\n}\n\nreturn messages;","outputs":1,"x":832,"y":826,"z":"5d7c6aac.810264","wires":[["6c8f8e38.64e858"]]},{"id":"1e6f937e.416065","type":"function","name":"Round to 1 degree, publish on local and bridged topic","func":"context.lastvalue = context.lastvalue || 0.0;\n\nvar roundedDegrees = Math.round(msg.payload);\nvar messages = [];\nmessages[0] = [];\n\nif (context.lastvalue != roundedDegrees) {\n\tmessages[0][0] = { payload: \"\" + roundedDegrees, topic: \"local/PowerMeter/temp/mattw\", retain: true };\n\tmessages[0][1] = { payload: \"\" + roundedDegrees, topic: \"PowerMeter/temp/mattw\", retain: true };\n\tcontext.lastvalue = roundedDegrees;\n} else {\n\tmsg = null;\n}\n\nreturn messages;","outputs":1,"x":828,"y":870,"z":"5d7c6aac.810264","wires":[["6c8f8e38.64e858"]]},{"id":"6c8f8e38.64e858","type":"mqtt out","name":"Publish CurrentCost Data","topic":"","broker":"6ae3bdcd.ab16bc","x":1184,"y":779,"z":"5d7c6aac.810264","wires":[]},{"id":"5c897914.4c7188","type":"comment","name":"Capture all data from CurrentCost and republish it on MQTT","info":"","x":246,"y":775,"z":"5d7c6aac.810264","wires":[]},{"id":"31944693.20e92a","type":"comment","name":"Take the published MQTT CurrentCost data and insert the relevant bits into a database","info":"","x":338,"y":1007,"z":"5d7c6aac.810264","wires":[]},{"id":"ee744eb5.ea9148","type":"mqtt in","name":"Subscribe to CurrentCost data","topic":"local/PowerMeter/#","broker":"6ae3bdcd.ab16bc","x":157,"y":1061,"z":"5d7c6aac.810264","wires":[["85137c4f.4f12d8"]]},{"id":"85137c4f.4f12d8","type":"function","name":"MapMQTTtoMySQL","func":"// Simple switch-ish statement to turn an MQTT topic into an SQL statement\nif (!msg.retain) {\n\tif (msg.topic.valueOf() == \"local/PowerMeter/CC/mattw\".valueOf()) {\n\t\tmsg.topic = \"INSERT INTO mydata.electricity(watts) values(\" + (msg.payload * 1000) + \")\";\n\t} else if (msg.topic.valueOf() == \"local/PowerMeter/temp/mattw\".valueOf()) {\n\t\tmsg.topic = \"INSERT INTO mydata.temperature(temperature) values(\" + msg.payload + \")\";\n\t} else {\n\t\tmsg = null;\n\t}\n} else {\n\tmsg = null;\n}\n\n\nreturn msg;","outputs":1,"x":413,"y":1061,"z":"5d7c6aac.810264","wires":[["50282fc3.85e478","7ee422e8.244804"]]},{"id":"50282fc3.85e478","type":"mysql","mydb":"3d5e337a.5a9084","name":"mydata","x":623,"y":1062,"z":"5d7c6aac.810264","wires":[["de5e2c03.f16f7"]]},{"id":"de5e2c03.f16f7","type":"debug","name":"","active":false,"console":false,"complete":false,"x":780,"y":1066,"z":"5d7c6aac.810264","wires":[]},{"id":"7ee422e8.244804","type":"debug","name":"","active":true,"console":false,"complete":false,"x":614,"y":1115,"z":"5d7c6aac.810264","wires":[]},{"id":"1453700a.8e435","type":"mqtt in","name":"Subscribe to wireless node transmissions","topic":"local/rfm12/nodes/#","broker":"6ae3bdcd.ab16bc","x":196,"y":109,"z":"7a69b8ae.02f248","wires":[["b0ca10c8.17fad"]]},{"id":"b0ca10c8.17fad","type":"function","name":"Store latest wireless node timestamps","func":"if (!msg.retain) {\n\tif (msg.topic.indexOf(\"local/rfm12/nodes/02\") >= 0) {\n\t\tcontext.global.wirelessnode2 = new Date().getTime();\n\t} else if (msg.topic.indexOf(\"local/rfm12/nodes/03\") >= 0) {\n\t\tcontext.global.wirelessnode2 = new Date().getTime();\n\t} else if (msg.topic.indexOf(\"local/rfm12/nodes/04\") >= 0) {\n\t\tcontext.global.wirelessnode2 = new Date().getTime();\n\t}\n}\n\nreturn null;","outputs":1,"x":530,"y":109,"z":"7a69b8ae.02f248","wires":[[]]},{"id":"75866a01.143574","type":"inject","name":"Check for recent wireless transmissions","topic":"","payload":"","payloadType":"date","repeat":"","crontab":"*/20 * * * *","once":false,"x":190,"y":224,"z":"7a69b8ae.02f248","wires":[["2023cc2a.c5fed4"]]},{"id":"2023cc2a.c5fed4","type":"function","name":"Alert if transmission not seen recently","func":"// If we haven't got any data at all from a wireless node, start witht the current time (msg.payload)\ncontext.global.wirelessnode2 = context.global.wirelessnode2 || msg.payload;\ncontext.global.wirelessnode3 = context.global.wirelessnode3 || msg.payload;\ncontext.global.wirelessnode4 = context.global.wirelessnode4 || msg.payload;\n\n// Initialise a global variable to store a flag so we only send 1 alert per \n// wireless node. This is reset once a wireless node has been seen again.\ncontext.wirelessnode2 = context.wirelessnode2 || {};\ncontext.wirelessnode3 = context.wirelessnode3 || {};\ncontext.wirelessnode4 = context.wirelessnode4 || {};\ncontext.wirelessnode2.alerted = context.wirelessnode2.alerted || false;\ncontext.wirelessnode3.alerted = context.wirelessnode3.alerted || false;\ncontext.wirelessnode4.alerted = context.wirelessnode4.alerted || false;\n\nvar messages = [];\nmessages[0] = [];\n\n// 60 minutes\nvar allowedTimeSinceIndoorTransmission = (1000 * 60 * 60);\n\n// 4 hours\nvar allowedTimeSinceOutdoorTransmission = (1000 * 60 * 240);\n\nif ((msg.payload - context.global.wirelessnode2) > allowedTimeSinceIndoorTransmission) {\n\tif (!context.wirelessnode2.alerted) {\n\t\tmessages[0].push({ payload: '\"No wireless data received from node 2 recently (' + msg.payload + ')\"' });\n\t\tcontext.wirelessnode2.alerted = true;\n\t}\n} else {\n\tcontext.wirelessnode2.alerted = false;\n}\n\nif ((msg.payload - context.global.wirelessnode3) > allowedTimeSinceIndoorTransmission) {\n\tif (!context.wirelessnode3.alerted) {\n\t\tmessages[0].push({ payload: '\"No wireless data received from node 3 recently (' + msg.payload + ')\"' });\n\t\tcontext.wirelessnode3.alerted = true;\n\t}\n} else {\n\tcontext.wirelessnode3.alerted = false;\n}\n\nif ((msg.payload - context.global.wirelessnode4) > allowedTimeSinceOutdoorTransmission) {\n\tif (!context.wirelessnode4.alerted) {\n\t\tmessages[0].push({ payload: '\"No wireless data received from node 4 recently (' + msg.payload + ')\"' });\n\t\tcontext.wirelessnode4.alerted = true;\n\t}\n} else {\n\tcontext.wirelessnode4.alerted = false;\n}\n\nreturn messages;","outputs":1,"x":530,"y":224,"z":"7a69b8ae.02f248","wires":[["d0aa5d56.0d66f"]]},{"id":"d0aa5d56.0d66f","type":"exec","command":"/home/mwhitehead/opt/sendtweet/sendtweet.sh","append":"","useSpawn":"","name":"","x":912,"y":225,"z":"7a69b8ae.02f248","wires":[[],[],[]]},{"id":"50c7a64e.e7b318","type":"comment","name":"Subscribe to wireless node transmissions on MQTT and update their locally stored \"last seen\" timestamp so we can act on it","info":"","x":450,"y":61,"z":"7a69b8ae.02f248","wires":[]},{"id":"5e8d98f4.1309a8","type":"comment","name":"Periodically check all of the locally stored timestamps and send a tweet if a wireless node hasn't been seen for a while","info":"","x":434,"y":180,"z":"7a69b8ae.02f248","wires":[]},{"id":"c694d562.b29eb","type":"inject","name":"TV off Monday-Friday night","topic":"local/rfm12/command","payload":"BBSB 4 A 0:","payloadType":"string","repeat":"","crontab":"*/10 0 * * 1-5","once":false,"x":209,"y":103,"z":"bef50b75.d162a","wires":[["9e55cefc.28361"]]},{"id":"9e55cefc.28361","type":"mqtt out","name":"Publish BBSB commands","topic":"","broker":"6ae3bdcd.ab16bc","x":631,"y":346,"z":"bef50b75.d162a","wires":[]},{"id":"7cae63a6.5f4b8c","type":"inject","name":"TV off Saturday-Sunday night","topic":"local/rfm12/command","payload":"BBSB 4 A 0:","payloadType":"string","repeat":"","crontab":"*/10 1 * * 6-7","once":false,"x":217,"y":147,"z":"bef50b75.d162a","wires":[["9e55cefc.28361"]]},{"id":"9ecd150b.6933b","type":"inject","name":"TV off Monday-Friday mornings","topic":"local/rfm12/command","payload":"BBSB 4 A 0:","payloadType":"string","repeat":"","crontab":"*/10 9 * * 1-5","once":false,"x":221,"y":61,"z":"bef50b75.d162a","wires":[["9e55cefc.28361"]]},{"id":"e91982b6.7e5f58","type":"inject","name":"TV off test","topic":"local/rfm12/command","payload":"BBSB 4 A 0:","payloadType":"string","repeat":"","crontab":"","once":false,"x":281,"y":225,"z":"bef50b75.d162a","wires":[["9e55cefc.28361"]]},{"id":"cf23a786.71678","type":"inject","name":"Broadband off Monday-Friday mornings","topic":"local/rfm12/command","payload":"BBSB 1 B 0:","payloadType":"string","repeat":"","crontab":"*/10 9 * * 1-5","once":false,"x":251,"y":307,"z":"bef50b75.d162a","wires":[["9e55cefc.28361"]]},{"id":"9422d6d0.300798","type":"inject","name":"Broadband off Monday-Friday night","topic":"local/rfm12/command","payload":"BBSB 1 B 0:","payloadType":"string","repeat":"","crontab":"*/10 0 * * *","once":false,"x":237,"y":352,"z":"bef50b75.d162a","wires":[["9e55cefc.28361"]]},{"id":"83a82ead.d7242","type":"inject","name":"Broadband on Monday-Friday lunchtime","topic":"local/rfm12/command","payload":"BBSB 1 B 1:","payloadType":"string","repeat":"","crontab":"*/10 12 * * 1-5","once":false,"x":250,"y":395,"z":"bef50b75.d162a","wires":[["9e55cefc.28361"]]},{"id":"f4ffbeb4.f1506","type":"inject","name":"Broadband on Monday-Friday morning","topic":"local/rfm12/command","payload":"BBSB 1 B 1:","payloadType":"string","repeat":"","crontab":"45 06 * * 1-5","once":false,"x":254,"y":440,"z":"bef50b75.d162a","wires":[[]]},{"id":"e9174ddd.8c681","type":"inject","name":"Lounge lamps off every night","topic":"local/rfm12/command","payload":"BBSB 1 A 0:","payloadType":"string","repeat":"","crontab":"*/10 1 * * *","once":false,"x":227,"y":555,"z":"bef50b75.d162a","wires":[["9e55cefc.28361"]]},{"id":"a49debd.5d9e998","type":"inject","name":"Dining room lamps off every night","topic":"local/rfm12/command","payload":"BBSB 1 A 0:","payloadType":"string","repeat":"","crontab":"*/10 1 * * *","once":false,"x":241,"y":599,"z":"bef50b75.d162a","wires":[["9e55cefc.28361"]]}]