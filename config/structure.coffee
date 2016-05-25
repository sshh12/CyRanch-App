# Read more about app structure at http://docs.appgyver.com

module.exports =

  # See styling options for tabs and other native components in app/common/native-styles/ios.css or app/common/native-styles/android.css
  tabs: [
    {
      title: "News"
      id: "news"
      location: "sshh12#index"
    }
    {
      title: "Grades"
      id: "grades"
      location: "sshh12#grades"
    }
    {
      title: "School"
      id: "classes"
      location: "sshh12#classes"
    }
    {
      title: "Teachers"
      id: "teachers"
      location: "sshh12#teachers"
    }
    {
      title: "Options"
      id: "settings"
      location: "sshh12#settings"
    }
  ]

  preloads: [
    {
      id: "calender"
      location: "sshh12#calender"
    }
    {
      id: "credits"
      location: "sshh12#credits"
    }
    {
      id: "schedule"
      location: "sshh12#schedule"
    }
  ]