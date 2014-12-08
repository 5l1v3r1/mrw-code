# CCarduino.pl

####################################################################

# read currentcost data from realtime for two nominated meters, and 
# package it up to send to serial port.

# Andy S-C 1-Jan-10 (my first program in 2010!)


####################################################################

# nominate two CurrentCost data topics here

$L_topic = "PowerMeter/CC/fake-laura";

$R_topic = "PowerMeter/CC/laura2";


# and name your serial port here
$serial = "/dev/ttyUSB0";


####################################################################



# the broker to connect to

$broker="realtime.ngi.ibm.com:1883";

# the topics to subscribe to (topic1,qos1,topic2,qos2....);


@topics=($L_topic,0,$R_topic,0);



# the name for the status birth/LWT (0/1 retained on status/$application_name)

$application_name = "CCarduino";

# 5 minute keepalive
$keepalive_timer = 300;


# do we want to get called back when the keepalive timer pops?
# (calls "keepalive_timeout_function")

$keepalive_timeout_callback=0;


# do we want the framework to call our initialise function when
# we first get connected to the broker?

$call_initialise=1;

####################################################################

# if the flag was set to call this when first connected ($call_initialise)

sub initialise
{
  print "Connected to broker\n";
  open (SERIAL,">$serial") || die "can't open serial port $serial";
  print "serial port opened\n";
#stop it chunking the output
select SERIAL;
$|=1;
select stdout;
}


####################################################################


# this gets called whenever a message arrives on one of the
# subscribed-to topics

sub parse
{
  my ($topic,$content) = @_;


  print "$topic->$content\n";


  if ($topic eq $L_topic)
  {
    $prefix = "G";
  }
  elsif ($topic eq $R_topic)
  {
    $prefix = "R";
  }
  else
  {
    print "unexpected message on topic: $topic\n";
    return;
  }

  # content comes in as 1.234
  # KW reading. So * 1000
  
  $content = int($content*1000);

  $value = sprintf("%04d",$content);
  
  print SERIAL $prefix.$value;  

  print "sent: ",$prefix.$value,"\n";


}


####################################################################


# if the flag was set to turn this on ($keepalive_timeout_callback=1)


sub keepalive_timeout_function
{
 
}


####################################################################

1
