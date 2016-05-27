//School Schedules

function timeslot(timestring, name){
    this.rawstring = timestring;

    this.rawname = name;

    var times_split = timestring.split("-");
    this.start_time = times_split[0];
    this.end_time = times_split[1];

    var date_now = new Date();

    var start_split = this.start_time.split(":");
    this.start_date = new Date(date_now.valueOf());
    this.start_date.setHours(start_split[0]);
    this.start_date.setMinutes(start_split[1]);
    this.start_date.setSeconds(0);

    var end_split = this.end_time.split(":");
    this.end_date = new Date(date_now.valueOf());
    this.end_date.setHours(end_split[0]);
    this.end_date.setMinutes(end_split[1]);
    this.end_date.setSeconds(0);

    this.getNameString = function(){
      var s = "";
      if(this.start_date.getHours() > 12){
        s += this.start_date.getHours() - 12;
      } else {
        s += this.start_date.getHours();
      }
      s += ":" + this.start_date.getUTCMinutes() + "-";

      if(this.end_date.getHours() > 12){
        s += this.end_date.getHours() - 12;
      } else {
        s += this.end_date.getHours();
      }
      s += ":" + this.end_date.getUTCMinutes();

      return s;
    };

    this.contains = function(other_date){
      return other_date.getTime() > this.start_date.getTime() && this.end_date.getTime() > other_date.getTime();
    };

    this.getTimeLeft = function(other_date){
      if(!this.contains(other_date)){
        return -1;
      } else {
        return Math.round((this.end_date.getTime() - other_date.getTime()) / (60 * 1000));
      }
    };

    this.toStringFormat = function(c_date){
      if(this.contains(c_date)){
        return "<div class=\"item\"><b>" + this.rawname + "</b> - " + this.getNameString() + ", <b>" + this.getTimeLeft(c_date) + " mins</b> left</div>";
      } else {
        return "<div class=\"item\"><b>" + this.rawname + "</b> - " + this.getNameString() + "</div>";
      }
    };
}

var ScheduleTitles = {
  "a": "A, Regular",
  "b": "B, Extended 2nd Period",
  "c": "C, Pep Rally"
};

var ASchedule = [[
    new timeslot("7:25-8:16", "1st"),
    new timeslot("8:22-9:15", "2nd"),
    new timeslot("9:21-10:12", "3rd"),
    new timeslot("12:42-13:33", "6th"),
    new timeslot("13:45-14:30", "7th"),
    new timeslot("14:45-15:10", "Tutorials")
  ],
  {
    "none": [new timeslot("10:18-12:36", "4th, 5th, Lunch")],
    "a": [
      new timeslot("10:12-10:42", "A Lunch"),
      new timeslot("10:48-11:39", "4th"),
      new timeslot("11:45-12:36", "5th")
    ],
    "b": [
      new timeslot("10:18-11:09", "4th"),
      new timeslot("11:09-11:39", "B Lunch"),
      new timeslot("11:45-12:36", "5th")
    ],
    "c": [
      new timeslot("10:18-11:09", "4th"),
      new timeslot("11:15-12:06", "5th"),
      new timeslot("12:06-12:36", "C Lunch")
    ]
  }
];

var BSchedule = [[
    new timeslot("7:25-8:10", "1st"),
    new timeslot("8:16-9:03", "2nd"),
    new timeslot("9:03-9:33", "Assembly"),
    new timeslot("9:39-10:24", "3rd"),
    new timeslot("12:54-13:39", "6th"),
    new timeslot("13:45-14:30", "7th"),
    new timeslot("14:45-15:10", "Tutorials")
  ],
  {
    "none": [new timeslot("10:30-12:48", "4th, 5th, Lunch")],
    "a": [
      new timeslot("10:24-10:54", "A Lunch"),
      new timeslot("11:00-11:51", "4th"),
      new timeslot("11:48-12:48", "5th")
    ],
    "b": [
      new timeslot("10:30-11:21", "4th"),
      new timeslot("11:21-11:51", "B Lunch"),
      new timeslot("11:57-12:48", "5th")
    ],
    "c": [
      new timeslot("10:30-11:21", "4th"),
      new timeslot("11:27-12:18", "5th"),
      new timeslot("12:18-12:48", "C Lunch")
    ]
  }
];

var CSchedule = [[
    new timeslot("7:25-8:12", "1st"),
    new timeslot("8:18-9:07", "2nd"),
    new timeslot("9:13-10:00", "3rd"),
    new timeslot("12:16-13:00", "6th"),
    new timeslot("13:06-14:30", "Pep Rally"),
    new timeslot("14:45-15:10", "Tutorials")
  ],
  {
    "none": [new timeslot("10:06-12:10", "4th, 5th, Lunch")],
    "a": [
      new timeslot("10:00-10:20", "A Lunch"),
      new timeslot("10:36-11:20", "4th"),
      new timeslot("11:26-12:10", "5th")
    ],
    "b": [
      new timeslot("10:06-11:50", "4th"),
      new timeslot("10:50-11:20", "B Lunch"),
      new timeslot("11:26-12:10", "5th")
    ],
    "c": [
      new timeslot("10:06-10:50", "4th"),
      new timeslot("10:56-11:40", "5th"),
      new timeslot("11:40-12:10", "C Lunch")
    ]
  }
];
