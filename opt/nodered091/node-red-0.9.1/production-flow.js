[{"type":"tab","id":"5d7c6aac.810264","label":"Serial to MQTT & DB"},{"type":"tab","id":"7a69b8ae.02f248","label":"Alerts from house"},{"type":"tab","id":"bef50b75.d162a","label":"Switch off appliances"},{"id":"3d5e337a.5a9084","type":"MySQLdatabase","host":"127.0.0.1","port":"3306","db":"mydata","tz":""},{"id":"6ae3bdcd.ab16bc","type":"mqtt-broker","broker":"localhost","port":"1883","clientid":""},{"id":"8019c7f2.618c78","type":"serial-port","serialport":"/dev/ttyUSBRFM","serialbaud":"57600","databits":8,"parity":"none","stopbits":1,"newline":"\\n","addchar":"false"},{"id":"fc5973ef.a12d38","type":"serial-port","serialport":"/dev/ttyUSBCC","serialbaud":"57600","databits":8,"parity":"none","stopbits":1,"newline":"\\r","addchar":"false"},{"id":"72bd61c1.c2afa","type":"mysql","mydb":"3d5e337a.5a9084","name":"mydata","x":582,"y":405,"z":"5d7c6aac.810264","wires":[["7bb0e53a.9510ec"]]},{"id":"9202d80a.014398","type":"serial in","name":"RFMHubReceiver","serial":"8019c7f2.618c78","x":131,"y":108,"z":"5d7c6aac.810264","wires":[["a7b33488.d54ad","4f75be59.8cfa6","ba4e8d62.0a2bc"]]},{"id":"a7b33488.d54ad","type":"function","name":"ParseInfoMessages","func":"if (msg.payload.indexOf(\"INFO\") >= 0) {\n\tmsg.payload = \"NR: \" + msg.payload;\n} else {\n\tmsg = null;\n}\n\nreturn msg;","outputs":1,"x":363,"y":118,"z":"5d7c6aac.810264","wires":[["69a25cdd.0c093c"]]},{"id":"69a25cdd.0c093c","type":"debug","name":"","active":false,"console":"false","complete":"false","x":545,"y":119,"z":"5d7c6aac.810264","wires":[]},{"id":"4f75be59.8cfa6","type":"function","name":"ParseDataMessages","func":"var messages = [];\n\n// Determine which wireless node is publishing - each one publishes slightly different\n// data so this allows us to process each one individually\nif (msg.payload.indexOf(\"DATA\") >= 0) {\n    var wirelessNodeNumber = \"\" + msg.payload.substring(msg.payload.indexOf(\"Nd\") + 2, msg.payload.indexOf(\"Nd\") + 5);\n    \n    // Strip off leading 0 i.e. Nd03 becomes just 3, Nd11 becomes 11\n    if (wirelessNodeNumber.indexOf(\"0\") == 0) {\n    \twirelessNodeNumber = wirelessNodeNumber.substring(1, wirelessNodeNumber.length);\n    }\n    \n    messages[0] = { payload: msg.payload, topic: \"\" + wirelessNodeNumber };\n}\n\nreturn messages;","outputs":1,"x":351,"y":177,"z":"5d7c6aac.810264","wires":[["87245b5e.3e3dc8"]]},{"id":"25bd8cd3.c9bb4c","type":"debug","name":"","active":false,"console":"false","complete":"false","x":1276,"y":175,"z":"5d7c6aac.810264","wires":[]},{"id":"22caa738.cde588","type":"inject","name":"Test loft node","topic":"","payload":"DATA: GROUP(53) HEADER(97) BYTES(15) Nd02 9 56 16 33","payloadType":"string","repeat":"","crontab":"","once":false,"x":130,"y":163,"z":"5d7c6aac.810264","wires":[["4f75be59.8cfa6"]]},{"id":"952463cb.4d5638","type":"function","name":"Parse loft node data","func":"// Node 2 - loft node\nvar messages = [];\n\nmessages[0] = [];\n\nvar tokens = msg.payload.split(\" \");\n\n// Current time & date\nvar dateStamp = \"\" + new Date();\ndateStamp = dateStamp.substring(dateStamp.indexOf(\" \") + 1, dateStamp.indexOf(\"GMT\"));\n\n// Get each of the individual elements from the data\nif (tokens.length > 0) {\n\tmessages[0][0] = { payload: \"\" + tokens[6], topic: \"local/rfm12/nodes/02/humidity\", retain: true };\n\tmessages[0][1] = { payload: \"\" + tokens[7], topic: \"local/rfm12/nodes/02/temp\", retain: true };\n\tmessages[0][2] = { payload: \"\" + tokens[8], topic: \"local/rfm12/nodes/02/voltage\", retain: true };\n\tmessages[0][3] = { payload: dateStamp, topic: \"local/rfm12/nodes/02/lastreceived\", retain: true };\n}\n\nreturn messages;","outputs":1,"x":1026,"y":122,"z":"5d7c6aac.810264","wires":[["25bd8cd3.c9bb4c","ebba594e.f81628"]]},{"id":"87245b5e.3e3dc8","type":"switch","name":"RouteWirelessNodeData","property":"topic","rules":[{"t":"eq","v":2,"v2":0},{"t":"eq","v":3,"v2":0},{"t":"eq","v":4,"v2":0}],"checkall":"false","outputs":3,"x":571,"y":179,"z":"5d7c6aac.810264","wires":[["45cf94c7.5b0954"],["ef79d576.5111f"],["37b4bac2.ab7246"]]},{"id":"71f47e41.b20d78","type":"function","name":"Parse lounge node data","func":"// Node 3 - lounge node\nvar messages = [];\nmessages[0] = [];\n\nvar tokens = msg.payload.split(\" \");\n\n// Current time & date\nvar dateStamp = \"\" + new Date();\ndateStamp = dateStamp.substring(dateStamp.indexOf(\" \") + 1, dateStamp.indexOf(\"GMT\"));\n\n// Get each of the individual elements from the data\nif (tokens.length > 0) {\n\tmessages[0][0] = { payload: \"\" + tokens[6], topic: \"local/rfm12/nodes/03/humidity\", retain: true };\n\tmessages[0][1] = { payload: \"\" + tokens[7], topic: \"local/rfm12/nodes/03/temp\", retain: true };\n\tmessages[0][2] = { payload: \"\" + tokens[8], topic: \"local/rfm12/nodes/03/voltage\", retain: true };\n\tmessages[0][3] = { payload: dateStamp, topic: \"local/rfm12/nodes/03/lastreceived\", retain: true };\n}\n\nreturn messages;","outputs":1,"x":1032,"y":174,"z":"5d7c6aac.810264","wires":[["25bd8cd3.c9bb4c","ebba594e.f81628"]]},{"id":"45cf94c7.5b0954","type":"delay","name":"","pauseType":"rate","timeout":"5","timeoutUnits":"seconds","rate":"1","rateUnits":"minute","randomFirst":"1","randomLast":"5","randomUnits":"seconds","drop":true,"x":823,"y":127,"z":"5d7c6aac.810264","wires":[["952463cb.4d5638"]]},{"id":"ef79d576.5111f","type":"delay","name":"","pauseType":"rate","timeout":"5","timeoutUnits":"minutes","rate":"1","rateUnits":"minute","randomFirst":"1","randomLast":"5","randomUnits":"seconds","drop":true,"x":831,"y":176,"z":"5d7c6aac.810264","wires":[["71f47e41.b20d78"]]},{"id":"37b4bac2.ab7246","type":"delay","name":"","pauseType":"rate","timeout":"5","timeoutUnits":"seconds","rate":"1","rateUnits":"minute","randomFirst":"1","randomLast":"5","randomUnits":"seconds","drop":true,"x":825,"y":232,"z":"5d7c6aac.810264","wires":[["51f96d11.f9309c"]]},{"id":"51f96d11.f9309c","type":"function","name":"Parse garden node data","func":"// Node 4 - garden node\nvar messages = [];\n\nmessages[0] = [];\n\nvar tokens = msg.payload.split(\" \");\n\n// Current time & date\nvar dateStamp = \"\" + new Date();\ndateStamp = dateStamp.substring(dateStamp.indexOf(\" \") + 1, dateStamp.indexOf(\"GMT\"));\n\n// Get each of the individual elements from the data\nif (tokens.length > 0) {\n\tmessages[0][0] = { payload: \"\" + tokens[5], topic: \"local/rfm12/nodes/04/moisture\", retain: true };\n\tmessages[0][1] = { payload: \"\" + tokens[6], topic: \"local/rfm12/nodes/04/voltage\", retain: true };\n\tmessages[0][2] = { payload: dateStamp, topic: \"local/rfm12/nodes/04/lastreceived\", retain: true };\n}\n\nreturn messages;","outputs":1,"x":1032,"y":234,"z":"5d7c6aac.810264","wires":[["25bd8cd3.c9bb4c","ebba594e.f81628"]]},{"id":"86887e.e46c5f8","type":"inject","name":"Test lounge node","topic":"","payload":"DATA: GROUP(53) HEADER(97) BYTES(15) Nd03 9 52 19 36","payloadType":"string","repeat":"","crontab":"","once":false,"x":143,"y":198,"z":"5d7c6aac.810264","wires":[["4f75be59.8cfa6"]]},{"id":"2ba453c5.c5c544","type":"inject","name":"Test garden node","topic":"","payload":"DATA: GROUP(53) HEADER(97) BYTES(15) Nd04 56 37","payloadType":"string","repeat":"","crontab":"","once":false,"x":143,"y":233,"z":"5d7c6aac.810264","wires":[["4f75be59.8cfa6"]]},{"id":"ebba594e.f81628","type":"mqtt out","name":"Publish all RFM12 data","topic":"","broker":"6ae3bdcd.ab16bc","x":1325,"y":226,"z":"5d7c6aac.810264","wires":[]},{"id":"27280dfb.49bc12","type":"mqtt in","name":"SubscribeRFM12Data","topic":"local/rfm12/#","broker":"6ae3bdcd.ab16bc","x":134,"y":405,"z":"5d7c6aac.810264","wires":[["748001a.0fc768"]]},{"id":"748001a.0fc768","type":"function","name":"MapMQTTtoMySQL","func":"// Simple switch-ish statement to turn an MQTT topic into an SQL statement\nif (!msg.retain) {\n\tif (msg.topic.valueOf() == \"local/rfm12/nodes/02/voltage\".valueOf()) {\n\t\tmsg.topic = \"INSERT INTO mydata.wirelessnodes(nodeid, voltage) values(2, \" + msg.payload + \")\";\n\t} else if (msg.topic.valueOf() == \"local/rfm12/nodes/03/voltage\".valueOf()) {\n\t\tmsg.topic = \"INSERT INTO mydata.wirelessnodes(nodeid, voltage) values(3, \" + msg.payload + \")\";\n\t} else if (msg.topic.valueOf() == \"local/rfm12/nodes/04/voltage\".valueOf()) {\n\t\tmsg.topic = \"INSERT INTO mydata.wirelessnodes(nodeid, voltage) values(4, \" + msg.payload + \")\";\n\t} else if (msg.topic.valueOf() == \"local/rfm12/nodes/02/temp\".valueOf()) {\n\t\tmsg.topic = \"INSERT INTO mydata.temperature2(temperature) values(\" + msg.payload + \")\";\n\t} else if (msg.topic.valueOf() == \"local/rfm12/nodes/02/humidity\".valueOf()) {\n\t\tmsg.topic = \"INSERT INTO mydata.humidity2(humidity) values(\" + msg.payload + \")\";\n\t} else if (msg.topic.valueOf() == \"local/rfm12/nodes/03/temp\".valueOf()) {\n\t\tmsg.topic = \"INSERT INTO mydata.temperature3(temperature) values(\" + msg.payload + \")\";\n\t} else if (msg.topic.valueOf() == \"local/rfm12/nodes/03/humidity\".valueOf()) {\n\t\tmsg.topic = \"INSERT INTO mydata.humidity3(humidity) values(\" + msg.payload + \")\";\n\t} else if (msg.topic.valueOf() == \"local/rfm12/nodes/04/moisture\".valueOf()) {\n\t    if (msg.payload < 1000) { // We seem to get some oddly high values occasionally, so ignore them\n\t    \tmsg.topic = \"INSERT INTO mydata.moisture(moisture) values(\" + msg.payload + \")\";\n\t\t} else {\n\t\t\tmsg = null;\n\t\t}\n\t} else {\n\t\tmsg = null;\n\t}\n} else {\n\tmsg = null;\n}\n\nreturn msg;","outputs":1,"x":378,"y":405,"z":"5d7c6aac.810264","wires":[["72bd61c1.c2afa","be2aca09.42451"]]},{"id":"7bb0e53a.9510ec","type":"debug","name":"","active":false,"console":false,"complete":false,"x":747,"y":407,"z":"5d7c6aac.810264","wires":[]},{"id":"be2aca09.42451","type":"debug","name":"","active":false,"console":false,"complete":false,"x":573,"y":461,"z":"5d7c6aac.810264","wires":[]},{"id":"447d1f37.7d672","type":"mqtt in","name":"BBSB Command Receiver","topic":"local/rfm12/command","broker":"6ae3bdcd.ab16bc","x":134.20001220703125,"y":600.0000305175781,"z":"5d7c6aac.810264","wires":[["a8290f87.7ffb48","84f9bf47.f1e76"]]},{"id":"a8290f87.7ffb48","type":"debug","name":"","active":false,"console":false,"complete":false,"x":349.9999694824219,"y":641.8001098632812,"z":"5d7c6aac.810264","wires":[]},{"id":"3cc1ffa4.e2f2d","type":"serial out","name":"Handle BBSB command","serial":"8019c7f2.618c78","x":723.1998901367188,"y":600,"z":"5d7c6aac.810264","wires":[]},{"id":"92ab7f.33f3348","type":"comment","name":"Receive serial data from an Arduino with an RFM12B chip, publish the relevant parts to various MQTT topics","info":"","x":393,"y":32,"z":"5d7c6aac.810264","wires":[]},{"id":"9f8d1180.7b3878","type":"comment","name":"Subscribe to the various MQTT topics that contain data from RFM12B wireless nodes, and put the right bits into a MySQL database","info":"","x":468,"y":349,"z":"5d7c6aac.810264","wires":[]},{"id":"7df659ae.a3983","type":"comment","name":"Subscribe to 'local/rfm12/command' and pass the command to an Arduino with an RFM12B chip to send it to the BBSB sockets in the house","info":"RFM12B chip to send it to the BBSB sockets in the house","x":485.20001220703125,"y":550.8000183105469,"z":"5d7c6aac.810264","wires":[]},{"id":"3dcf3f37.0f4ff8","type":"function","name":"CurrentCost Watts","func":"\nvar result = msg.payload;\nvar messages = [];\n\ntry {\n   // Use result.msg.sensor[0] to get the number/ID of the sensor this message is for\n   var sensorID = parseInt(result.msg.id[0]);\n   var topicString = \"\";\n   var nodeOutputIndex = 0;\n   \n   // We map the sensor ID to the reading we know that sensor measures\n   switch (sensorID) {\n   \tcase 883: \n   \t\ttopicString = \"MAINS\"; nodeOutputIndex = 0; break;\n   \tcase 3739: \n   \t\ttopicString = \"SOLAR\"; nodeOutputIndex = 1; break;\n   \tcase 3636: \n   \t\ttopicString = \"APPLIANCE\"; nodeOutputIndex = 2; break;\n   \tdefault:\n   \t    topicString = \"UNKNOWN_SENSOR\";\n   }\n   \n   messages[nodeOutputIndex] = { payload : result.msg.ch1[0].watts[0]*1, topic: topicString };\n} catch (error) {\n   // console.log(\"Error: \" + error);\n   messages = null;\n}\n\nreturn messages;","outputs":"3","x":513,"y":846.9999389648438,"z":"5d7c6aac.810264","wires":[["dc4d8cd5.0364d8"],["879baf5f.c3c838"],["a4682ee3.f02678"]]},{"id":"ee5f547d.c07e08","type":"function","name":"CurrentCost Temp","func":"\nvar result = msg.payload;\nmsg.topic=\"cc-temperature\";\n\ntry {\n   msg.payload = (result.msg.tmpr[0])*1;\n} catch (error) {\n   msg = null;\n}\n\nreturn msg;","outputs":1,"x":517,"y":971,"z":"5d7c6aac.810264","wires":[["1e6f937e.416065","5ea0fb17.d3ab04"]]},{"id":"fe326677.50921","type":"debug","name":"Raw current cost data","active":false,"console":"false","complete":"false","x":394,"y":1022,"z":"5d7c6aac.810264","wires":[]},{"id":"dc4d8cd5.0364d8","type":"function","name":"(Mains) Round to 10 watts, publish on local and bridged topic","func":"context.lastvalue = typeof context.lastvalue === 'undefined' ? -1 : context.lastvalue;\n\nvar isFirstLoopAfterStarting = context.lastvalue == -1;\n\n// Then round to the nearest 10 watts since we always do this for inbound watts\nvar roundedWatts = Math.round(msg.payload / 10) * 10;\n\nroundedWatts = roundedWatts / 1000;\nvar messages = [];\nmessages[0] = [];\n\nif (context.lastvalue != roundedWatts && roundedWatts > 0) {\n    // Re-publish the last value so graph plots are square\n    if (!isFirstLoopAfterStarting) {\n    \tmessages[0].push({ payload: \"\" + context.lastvalue, topic: \"local/PowerMeter/CC/mattw\", retain: true });\n    }\n    \n    // Then publish the new data\n    if (!isFirstLoopAfterStarting) {\n\t\tmessages[0].push({ payload: \"\" + roundedWatts, topic: \"local/PowerMeter/CC/mattw\", retain: true });\n\t\tmessages[0].push({ payload: \"\" + roundedWatts, topic: \"PowerMeter/CC/mattw\", retain: true });\n\t}\n\tcontext.lastvalue = roundedWatts;\n}\n\nreturn messages;","outputs":1,"x":855,"y":807,"z":"5d7c6aac.810264","wires":[["6c8f8e38.64e858","21389240.e9b376"]]},{"id":"1e6f937e.416065","type":"function","name":"Round to 1 degree, publish on local and bridged topic","func":"context.lastvalue = typeof context.lastvalue === 'undefined' ? -1 : context.lastvalue;\n\nvar isFirstLoopAfterStarting = context.lastvalue == -1;\n\nvar roundedDegrees = Math.round(msg.payload);\nvar messages = [];\nmessages[0] = [];\n\nif (context.lastvalue != roundedDegrees) {\n\t// Re-publish the old value so graph plots are square\n\tif (!isFirstLoopAfterStarting) {\n\t\tmessages[0].push({ payload: \"\" + context.lastvalue, topic: \"local/PowerMeter/temp/mattw\", retain: true });\n\t}\n\t\n\t// Then publish the new real value\n\tmessages[0].push({ payload: \"\" + roundedDegrees, topic: \"local/PowerMeter/temp/mattw\", retain: true });\n\tmessages[0].push({ payload: \"\" + roundedDegrees, topic: \"PowerMeter/temp/mattw\", retain: true });\n\tcontext.lastvalue = roundedDegrees;\n} else {\n\tmsg = null;\n}\n\nreturn messages;","outputs":1,"x":829,"y":948,"z":"5d7c6aac.810264","wires":[["ad297be5.b4a758"]]},{"id":"6c8f8e38.64e858","type":"mqtt out","name":"Publish CurrentCost Data","topic":"","broker":"6ae3bdcd.ab16bc","x":1407,"y":849,"z":"5d7c6aac.810264","wires":[]},{"id":"5c897914.4c7188","type":"comment","name":"Capture all data from CurrentCost and republish it on MQTT","info":"","x":242,"y":746,"z":"5d7c6aac.810264","wires":[]},{"id":"31944693.20e92a","type":"comment","name":"Take the published MQTT CurrentCost data and insert the relevant bits into a database","info":"","x":328,"y":1085,"z":"5d7c6aac.810264","wires":[]},{"id":"ee744eb5.ea9148","type":"mqtt in","name":"Subscribe to CurrentCost data","topic":"local/PowerMeter/#","broker":"6ae3bdcd.ab16bc","x":147,"y":1139,"z":"5d7c6aac.810264","wires":[["85137c4f.4f12d8"]]},{"id":"85137c4f.4f12d8","type":"function","name":"MapMQTTtoMySQL","func":"// Simple switch-ish statement to turn an MQTT topic into an SQL statement\nif (!msg.retain) {\n\tif (msg.topic == \"local/PowerMeter/CC/mattw\") {\n\t\tmsg.topic = \"INSERT INTO mydata.electricity(watts) values(\" + (msg.payload * 1000) + \")\";\n\t} else if (msg.topic == \"local/PowerMeter/temp/mattw\") {\n\t\tmsg.topic = \"INSERT INTO mydata.temperature(temperature) values(\" + msg.payload + \")\";\n\t} else if (msg.topic == \"local/PowerMeter/appliance\") {\n\t\tmsg.topic = \"INSERT INTO mydata.miscappliance(watts,appliancenumber) values(\" + msg.payload + \",1)\";\n\t} else {\n\t\tmsg = null;\n\t}\n} else {\n\tmsg = null;\n}\n\nreturn msg;","outputs":1,"x":403,"y":1139,"z":"5d7c6aac.810264","wires":[["50282fc3.85e478"]]},{"id":"50282fc3.85e478","type":"mysql","mydb":"3d5e337a.5a9084","name":"mydata","x":613,"y":1140,"z":"5d7c6aac.810264","wires":[["de5e2c03.f16f7"]]},{"id":"de5e2c03.f16f7","type":"debug","name":"","active":false,"console":false,"complete":false,"x":770,"y":1140,"z":"5d7c6aac.810264","wires":[]},{"id":"1453700a.8e435","type":"mqtt in","name":"Subscribe to wireless node transmissions","topic":"local/rfm12/nodes/#","broker":"6ae3bdcd.ab16bc","x":196,"y":109,"z":"7a69b8ae.02f248","wires":[["b0ca10c8.17fad"]]},{"id":"b0ca10c8.17fad","type":"function","name":"Store latest wireless node timestamps","func":"if (!msg.retain) {\n\tif (msg.topic.indexOf(\"local/rfm12/nodes/02\") >= 0) {\n\t\tcontext.global.wirelessnode2 = new Date().getTime();\n\t} else if (msg.topic.indexOf(\"local/rfm12/nodes/03\") >= 0) {\n\t\tcontext.global.wirelessnode3 = new Date().getTime();\n\t} else if (msg.topic.indexOf(\"local/rfm12/nodes/04\") >= 0) {\n\t\tcontext.global.wirelessnode4 = new Date().getTime();\n\t}\n}\n\nreturn null;","outputs":1,"x":530,"y":109,"z":"7a69b8ae.02f248","wires":[[]]},{"id":"75866a01.143574","type":"inject","name":"Check for recent wireless transmissions","topic":"","payload":"","payloadType":"date","repeat":"","crontab":"0 */2 * * *","once":false,"x":190,"y":224,"z":"7a69b8ae.02f248","wires":[["2023cc2a.c5fed4"]]},{"id":"2023cc2a.c5fed4","type":"function","name":"Alert if transmission not seen recently","func":"// If we haven't got any data at all from a wireless node, start with the current time (msg.payload)\ncontext.global.wirelessnode2 = typeof context.global.wirelessnode2 === 'undefined' ? msg.payload : context.global.wirelessnode2;\ncontext.global.wirelessnode3 = typeof context.global.wirelessnode3 === 'undefined' ? msg.payload : context.global.wirelessnode3;\ncontext.global.wirelessnode4 = typeof context.global.wirelessnode4 === 'undefined' ? msg.payload : context.global.wirelessnode4;\n\n\n// Initialise a local variable to store a flag so we only send 1 alert per \n// wireless node. This is reset once a wireless node has been seen again.\ncontext.wirelessnode2 = context.wirelessnode2 || {};\ncontext.wirelessnode3 = context.wirelessnode3 || {};\ncontext.wirelessnode4 = context.wirelessnode4 || {};\ncontext.wirelessnode2.alerted = typeof context.wirelessnode2.alerted === 'undefined' ? false : context.wirelessnode2.alerted;\ncontext.wirelessnode3.alerted = typeof context.wirelessnode3.alerted === 'undefined' ? false : context.wirelessnode3.alerted;\ncontext.wirelessnode4.alerted = typeof context.wirelessnode4.alerted === 'undefined' ? false : context.wirelessnode4.alerted;\n\nvar messages = [];\nmessages[0] = [];\n\n// 12 hours\nvar allowedTimeSinceIndoorTransmission = (1000 * 60 * 720);\n\n// 12 hours\nvar allowedTimeSinceOutdoorTransmission = (1000 * 60 * 720);\n\nif ((msg.payload - context.global.wirelessnode2) > allowedTimeSinceIndoorTransmission) {\n\tif (!context.wirelessnode2.alerted) {\n\t\tmessages[0].push({ payload: '\"No wireless data received from node 2 recently (' + msg.payload + ')\"' });\n\t\tcontext.wirelessnode2.alerted = true;\n\t}\n} else {\n\tcontext.wirelessnode2.alerted = false;\n}\n\nif ((msg.payload - context.global.wirelessnode3) > allowedTimeSinceIndoorTransmission) {\n\tif (!context.wirelessnode3.alerted) {\n\t\tmessages[0].push({ payload: '\"No wireless data received from node 3 recently (' + msg.payload + ')\"' });\n\t\tcontext.wirelessnode3.alerted = true;\n\t}\n} else {\n\tcontext.wirelessnode3.alerted = false;\n}\n\nif ((msg.payload - context.global.wirelessnode4) > allowedTimeSinceOutdoorTransmission) {\n\tif (!context.wirelessnode4.alerted) {\n\t\tmessages[0].push({ payload: '\"No wireless data received from node 4 recently (' + msg.payload + ')\"' });\n\t\tcontext.wirelessnode4.alerted = true;\n\t}\n} else {\n\tcontext.wirelessnode4.alerted = false;\n}\n\nreturn messages;","outputs":1,"x":530,"y":224,"z":"7a69b8ae.02f248","wires":[["d0aa5d56.0d66f"]]},{"id":"d0aa5d56.0d66f","type":"exec","command":"/home/mwhitehead/opt/sendtweet/sendtweet.sh","append":"","useSpawn":"","name":"","x":912,"y":225,"z":"7a69b8ae.02f248","wires":[[],[],[]]},{"id":"50c7a64e.e7b318","type":"comment","name":"Subscribe to wireless node transmissions on MQTT and update their locally stored \"last seen\" timestamp so we can act on it","info":"","x":450,"y":61,"z":"7a69b8ae.02f248","wires":[]},{"id":"5e8d98f4.1309a8","type":"comment","name":"Periodically check all of the locally stored timestamps and send a tweet if a wireless node hasn't been seen for a while","info":"","x":434,"y":180,"z":"7a69b8ae.02f248","wires":[]},{"id":"c694d562.b29eb","type":"inject","name":"TV off Monday-Friday night","topic":"local/rfm12/command","payload":"BBSB 4 A 0:","payloadType":"string","repeat":"","crontab":"*/10 0 * * 1-5","once":false,"x":209,"y":110,"z":"bef50b75.d162a","wires":[["9e55cefc.28361"]]},{"id":"9e55cefc.28361","type":"mqtt out","name":"Publish BBSB commands","topic":"","broker":"6ae3bdcd.ab16bc","x":767,"y":395,"z":"bef50b75.d162a","wires":[]},{"id":"7cae63a6.5f4b8c","type":"inject","name":"TV off Saturday-Sunday night","topic":"local/rfm12/command","payload":"BBSB 4 A 0:","payloadType":"string","repeat":"","crontab":"*/3 1 * * 6-7","once":false,"x":217,"y":154,"z":"bef50b75.d162a","wires":[["9e55cefc.28361"]]},{"id":"9ecd150b.6933b","type":"inject","name":"TV off Monday-Friday mornings","topic":"local/rfm12/command","payload":"BBSB 4 A 0:","payloadType":"string","repeat":"","crontab":"*/10 9 * * 1-5","once":false,"x":221,"y":68,"z":"bef50b75.d162a","wires":[["9e55cefc.28361"]]},{"id":"e91982b6.7e5f58","type":"inject","name":"TV off test","topic":"local/rfm12/command","payload":"BBSB 4 A 0:","payloadType":"string","repeat":"","crontab":"","once":false,"x":302,"y":264,"z":"bef50b75.d162a","wires":[["9e55cefc.28361"]]},{"id":"cf23a786.71678","type":"inject","name":"Broadband off Monday-Friday mornings","topic":"local/rfm12/command","payload":"BBSB 5 A 0:","payloadType":"string","repeat":"","crontab":"00 09 * * 1-5","once":false,"x":249.79998779296875,"y":362,"z":"bef50b75.d162a","wires":[["77d43200.1b3578"]]},{"id":"9422d6d0.300798","type":"inject","name":"Broadband off every night","topic":"local/rfm12/command","payload":"BBSB 5 A 0:","payloadType":"string","repeat":"","crontab":"*/10 1 * * *","once":false,"x":205,"y":489,"z":"bef50b75.d162a","wires":[["9e55cefc.28361"]]},{"id":"83a82ead.d7242","type":"inject","name":"Broadband on Monday-Friday lunchtime","topic":"local/rfm12/command","payload":"BBSB 5 A 1:","payloadType":"string","repeat":"","crontab":"*/10 12 * * 1-5","once":false,"x":248,"y":533,"z":"bef50b75.d162a","wires":[["9e55cefc.28361"]]},{"id":"f4ffbeb4.f1506","type":"inject","name":"Broadband on Monday-Friday morning","topic":"local/rfm12/command","payload":"BBSB 5 A 1:","payloadType":"string","repeat":"","crontab":"45 06 * * 1-5","once":false,"x":245,"y":405,"z":"bef50b75.d162a","wires":[["9e55cefc.28361"]]},{"id":"e9174ddd.8c681","type":"inject","name":"Lounge lamps off every night","topic":"local/rfm12/command","payload":"BBSB 1 A 0:","payloadType":"string","repeat":"","crontab":"*/10 1 * * *","once":false,"x":209.79998779296875,"y":658.4000244140625,"z":"bef50b75.d162a","wires":[["9e55cefc.28361"]]},{"id":"a49debd.5d9e998","type":"inject","name":"Dining room lamps off every night","topic":"local/rfm12/command","payload":"BBSB 2 A 0:","payloadType":"string","repeat":"","crontab":"*/10 1 * * *","once":false,"x":223.80001831054688,"y":701.5999755859375,"z":"bef50b75.d162a","wires":[["9e55cefc.28361"]]},{"id":"879baf5f.c3c838","type":"function","name":"(Solar) Round to 10 watts, publish on local topic","func":"context.lastvalue = typeof context.lastvalue === 'undefined' ? -1 : context.lastvalue;\ncontext.global.solarwatts = typeof context.global.solarwatts === 'undefined' ? -1 : context.global.solarwatts;\ncontext.global.solarlasttimestamp = typeof context.global.solarlasttimestamp === 'undefined' ? -1 : context.global.solarlasttimestamp;\n\nvar isFirstLoopAfterStarting = context.lastvalue == -1;\n\nNumber.prototype.roundTo = function(multiple) {\n   var result = this % multiple;\n   if (result <= (multiple / 2)) { \n       return this - result;\n   } else {\n       return this + multiple - result;\n   }\n}\n\n//var roundedWatts = msg.payload.roundTo(10);\nvar roundedWatts = Math.round(msg.payload / 10) * 10;\n\nvar messages = [];\nmessages[0] = [];\n\n// Set the node global variable for other nodes to use\ncontext.global.solarwatts = roundedWatts;\ncontext.global.solarlasttimestamp = new Date().getTime();\n\nif (context.lastvalue != roundedWatts) {\n    // Re-publish the last value so graph plots are square\n    if (!isFirstLoopAfterStarting) {\n    \tmessages[0].push({ payload: \"\" + context.lastvalue, topic: \"local/PowerMeter/solar\", retain: true });\n    }\n    \n    // Then publish the new data\n    if (!isFirstLoopAfterStarting) {\n\t\tmessages[0].push({ payload: \"\" + roundedWatts, topic: \"local/PowerMeter/solar\", retain: true });\n\t}\n\tcontext.lastvalue = roundedWatts;\n}\n\nreturn messages;","outputs":1,"x":814,"y":847,"z":"5d7c6aac.810264","wires":[["6c8f8e38.64e858","bc7ee047.345dd8"]]},{"id":"7e83d4fe.fffdec","type":"mqtt in","name":"Subscribe to CurrentCost solar data","topic":"local/PowerMeter/solar","broker":"6ae3bdcd.ab16bc","x":173,"y":1269,"z":"5d7c6aac.810264","wires":[["427d22ca.c3329c","3a1ec730.ae2938"]]},{"id":"427d22ca.c3329c","type":"debug","name":"","active":false,"console":false,"complete":false,"x":757,"y":1270,"z":"5d7c6aac.810264","wires":[]},{"id":"5579f23b.df3d9c","type":"comment","name":"Subscribe to solar data - once we have the panel actually plugged in, do something with it here","info":"","x":354,"y":1223,"z":"5d7c6aac.810264","wires":[]},{"id":"b1c5ca5c.2bb738","type":"inject","name":"Broadband on Saturday/Sunday morning","topic":"local/rfm12/command","payload":"BBSB 5 A 1:","payloadType":"string","repeat":"","crontab":"*/5 8 * * 0,6","once":false,"x":252,"y":447,"z":"bef50b75.d162a","wires":[["9e55cefc.28361"]]},{"id":"ad297be5.b4a758","type":"delay","name":"","pauseType":"rate","timeout":"5","timeoutUnits":"seconds","rate":"60","rateUnits":"hour","randomFirst":"1","randomLast":"5","randomUnits":"seconds","drop":true,"x":1140,"y":948,"z":"5d7c6aac.810264","wires":[["6c8f8e38.64e858","f4cf8f11.1a365"]]},{"id":"3a1ec730.ae2938","type":"function","name":"MapMQTTtoMySQL","func":"// Simple switch-ish statement to turn an MQTT topic into an SQL statement\nif (!msg.retain) {\n\tif (msg.topic.valueOf() == \"local/PowerMeter/solar\".valueOf()) {\n\t\tmsg.topic = \"INSERT INTO mydata.solar(watts) values(\" + (msg.payload) + \")\";\n\t} else {\n\t\tmsg = null;\n\t}\n} else {\n\tmsg = null;\n}\n\n\nreturn msg;","outputs":1,"x":442,"y":1304,"z":"5d7c6aac.810264","wires":[["ce6033f2.f05f5"]]},{"id":"ce6033f2.f05f5","type":"mysql","mydb":"3d5e337a.5a9084","name":"","x":617,"y":1304,"z":"5d7c6aac.810264","wires":[["427d22ca.c3329c"]]},{"id":"ef7cb541.201398","type":"mqtt in","name":"Check for WFH flag","topic":"local/power/routerstandby","broker":"6ae3bdcd.ab16bc","x":170,"y":844,"z":"bef50b75.d162a","wires":[["8fb8e410.f134c"]]},{"id":"dd6ea0d0.f8446","type":"debug","name":"","active":false,"console":false,"complete":false,"x":578,"y":844,"z":"bef50b75.d162a","wires":[]},{"id":"8fb8e410.f134c","type":"function","name":"Set WFH context","func":"if (msg.payload == \"disabled\") {\n\t// Router power-down during the morning is disabled because someone is WFH\n\tcontext.global.wfh = true;\n} else {\n\tcontext.global.wfh = false;\n}\n\nreturn msg;","outputs":1,"x":379,"y":844,"z":"bef50b75.d162a","wires":[["dd6ea0d0.f8446"]]},{"id":"77d43200.1b3578","type":"function","name":"WFH check","func":"context.global.wfh = typeof context.global.wfh === 'undefined' ? false : context.global.wfh;\n\n// If we know someone is WFH, don't pass this message on to the BBSB transmitter\nif (context.global.wfh) {\n\tmsg = null;\n}\n\nreturn msg;","outputs":1,"x":476,"y":362,"z":"bef50b75.d162a","wires":[["9e55cefc.28361"]]},{"id":"3ef2bb5f.a15c74","type":"comment","name":"Set a global flag to indicate if someone is WFH, so we don't turn absolutely everything off during the day","info":"","x":433,"y":797,"z":"bef50b75.d162a","wires":[]},{"id":"9d4b821c.be7d48","type":"inject","name":"TV on test","topic":"local/rfm12/command","payload":"BBSB 4 A 1:","payloadType":"string","repeat":"","crontab":"","once":false,"x":302,"y":222,"z":"bef50b75.d162a","wires":[["9e55cefc.28361"]]},{"id":"bc7ee047.345dd8","type":"debug","name":"","active":false,"console":"false","complete":"false","x":1165,"y":903,"z":"5d7c6aac.810264","wires":[]},{"id":"ba4e8d62.0a2bc","type":"debug","name":"","active":false,"console":false,"complete":false,"x":329,"y":73,"z":"5d7c6aac.810264","wires":[]},{"id":"5ea0fb17.d3ab04","type":"debug","name":"Temperature readings","active":false,"console":"false","complete":"false","x":730,"y":988,"z":"5d7c6aac.810264","wires":[]},{"id":"f4cf8f11.1a365","type":"debug","name":"Filtered temp data","active":false,"console":"false","complete":"false","x":1384,"y":948,"z":"5d7c6aac.810264","wires":[]},{"id":"3f12d722.2c988","type":"inject","name":"Tree lights off every night","topic":"local/rfm12/command","payload":"BBSB 3 A 0:","payloadType":"string","repeat":"","crontab":"*/10 1-18 * * *","once":false,"x":198.19998168945312,"y":614.0000610351562,"z":"bef50b75.d162a","wires":[["9e55cefc.28361"]]},{"id":"84f9bf47.f1e76","type":"trigger","op1":"","op2":"","op1type":"pay","op2type":"pay","duration":"5","extend":"false","units":"s","name":"Duplicate transmission payload","x":426.2000732421875,"y":599.800048828125,"z":"5d7c6aac.810264","wires":[["3cc1ffa4.e2f2d","8652dc14.b5905"]]},{"id":"8652dc14.b5905","type":"debug","name":"","active":false,"console":false,"complete":false,"x":670.2000122070312,"y":639.7999267578125,"z":"5d7c6aac.810264","wires":[]},{"id":"b95521e9.6eefc8","type":"debug","name":"","active":false,"console":"false","complete":"false","x":481,"y":795,"z":"5d7c6aac.810264","wires":[]},{"id":"21389240.e9b376","type":"debug","name":"","active":false,"console":"false","complete":"false","x":1188,"y":746,"z":"5d7c6aac.810264","wires":[]},{"id":"a4682ee3.f02678","type":"function","name":"(Appliance) Round to 10 watts, publish on local topic","func":"context.lastvalue = typeof context.lastvalue === 'undefined' ? -1 : context.lastvalue;\ncontext.global.appliancewatts = typeof context.global.appliancewatts === 'undefined' ? -1 : context.global.appliancewatts;\ncontext.global.appliancelasttimestamp = typeof context.global.appliancelasttimestamp === 'undefined' ? -1 : context.global.appliancelasttimestamp;\n\nvar isFirstLoopAfterStarting = context.lastvalue == -1;\n\nNumber.prototype.roundTo = function(multiple) {\n   var result = this % multiple;\n   if (result <= (multiple / 2)) { \n       return this - result;\n   } else {\n       return this + multiple - result;\n   }\n}\n\n//var roundedWatts = msg.payload.roundTo(10);\nvar roundedWatts = msg.payload;\n\nvar messages = [];\nmessages[0] = [];\n\n// Set the node global variable for other nodes to use\ncontext.global.appliancewatts = roundedWatts;\ncontext.global.appliancelasttimestamp = new Date().getTime();\n\nif (context.lastvalue != roundedWatts) {\n    // Re-publish the last value so graph plots are square\n    if (!isFirstLoopAfterStarting) {\n    \tmessages[0].push({ payload: \"\" + context.lastvalue, topic: \"local/PowerMeter/appliance\", retain: true });\n    }\n    \n    // Then publish the new data\n    if (!isFirstLoopAfterStarting) {\n\t\tmessages[0].push({ payload: \"\" + roundedWatts, topic: \"local/PowerMeter/appliance\", retain: true });\n\t}\n\tcontext.lastvalue = roundedWatts;\n}\n\nreturn messages;","outputs":1,"x":828,"y":887,"z":"5d7c6aac.810264","wires":[["bc7ee047.345dd8","6c8f8e38.64e858"]]},{"id":"9eb06e29.3edda8","type":"xml","name":"","x":327,"y":846,"z":"5d7c6aac.810264","wires":[["b95521e9.6eefc8","3dcf3f37.0f4ff8","ee5f547d.c07e08"]]},{"id":"865b8d53.a59818","type":"mqtt in","name":"Raw current cost data","topic":"local/currentcostraw","broker":"6ae3bdcd.ab16bc","x":122,"y":846,"z":"5d7c6aac.810264","wires":[["9eb06e29.3edda8","fe326677.50921"]]},{"id":"a28e2d8b.179d88","type":"http request","name":"Get Nest Device Data","method":"GET","url":"https://developer-api.nest.com/devices.json?auth=c.WmDhPHFDAqb645JFRaLSX05widWSCBeTzznhPBNpPMc4zHANvPjpzAGMpzRwKhJzDj80cqVQnG1GlbqdIhwccZqANOUDUXizq0gEqUaK9bSDUlp0mrMke78Wolu8pAJYZZAhEsP4Qg15gJam","x":478,"y":1452,"z":"5d7c6aac.810264","wires":[["60f21aa1.d9e84c"]]},{"id":"d5e16a63.76d78","type":"inject","name":"Poll the Nest server occasionally","topic":"","payload":"","payloadType":"date","repeat":"1800","crontab":"","once":false,"x":181,"y":1491,"z":"5d7c6aac.810264","wires":[["a28e2d8b.179d88","439ab4cd.93988c"]]},{"id":"60f21aa1.d9e84c","type":"json","name":"","x":673,"y":1452,"z":"5d7c6aac.810264","wires":[["ff9e5535.ea2268"]]},{"id":"ff9e5535.ea2268","type":"function","name":"Extract device data","func":"var msgs = [];\nvar sqlQuery = '';\nvar nextValue = 0;\n\nfor (var nextThermostat in msg.payload.thermostats) {\n   nextValue = msg.payload.thermostats[nextThermostat].ambient_temperature_c;\n   sqlQuery = 'INSERT INTO mydata.temperature4(temperature) values(' + nextValue + ')';\n   msgs[0] = {'payload':{'currenttemperature':nextValue}, 'topic':sqlQuery};\n   \n   nextValue = msg.payload.thermostats[nextThermostat].humidity;\n   sqlQuery = 'INSERT INTO mydata.humidity4(humidity) values(' + nextValue + ')';\n   msgs[1] = {'payload':{'currenthumidity':nextValue}, 'topic':sqlQuery};\n   \n   msgs[2] = {'payload':{'lastupdate':msg.payload.thermostats[nextThermostat].last_connection}};\n}\n\nreturn msgs;","outputs":"3","x":857,"y":1452,"z":"5d7c6aac.810264","wires":[["58f6c9be.86adb8","91a6e1e5.9fe558"],["58f6c9be.86adb8","91a6e1e5.9fe558"],["58f6c9be.86adb8"]]},{"id":"439ab4cd.93988c","type":"http request","name":"Get Nest Structure Data","method":"GET","url":"https://developer-api.nest.com/structures.json?auth=c.WmDhPHFDAqb645JFRaLSX05widWSCBeTzznhPBNpPMc4zHANvPjpzAGMpzRwKhJzDj80cqVQnG1GlbqdIhwccZqANOUDUXizq0gEqUaK9bSDUlp0mrMke78Wolu8pAJYZZAhEsP4Qg15gJam","x":487,"y":1535,"z":"5d7c6aac.810264","wires":[["49424e19.3ac6e8"]]},{"id":"49424e19.3ac6e8","type":"json","name":"","x":676,"y":1535,"z":"5d7c6aac.810264","wires":[["6415482c.515498"]]},{"id":"6415482c.515498","type":"function","name":"Extract structure data","func":"for (var nextStructure in msg.payload) {\n   msg = {'payload':{'away': msg.payload[nextStructure].away}};\n}\nreturn msg;","outputs":1,"x":865,"y":1535,"z":"5d7c6aac.810264","wires":[["58f6c9be.86adb8"]]},{"id":"c3994759.4848e","type":"comment","name":"Occasionally get the latest data from the Nest thermostat in the hallway and store it in our local database","info":"","x":386,"y":1402,"z":"5d7c6aac.810264","wires":[]},{"id":"58f6c9be.86adb8","type":"debug","name":"","active":true,"console":"false","complete":"false","x":1112,"y":1536,"z":"5d7c6aac.810264","wires":[]},{"id":"91a6e1e5.9fe558","type":"mysql","mydb":"3d5e337a.5a9084","name":"","x":1111,"y":1420,"z":"5d7c6aac.810264","wires":[["6da5dcf4.c78194"]]},{"id":"6da5dcf4.c78194","type":"debug","name":"","active":false,"console":"false","complete":"false","x":1252,"y":1420,"z":"5d7c6aac.810264","wires":[]}]