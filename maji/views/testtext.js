extends layout

block content
    h1 Add a new device
    form(action="/text" method="post")
        input(type="text" name="from" placeholder="Device Number")
        br
        input(type="text" name="Body" placeholder="Text Body")
        br
        div
            input(type="submit" value="Send Text")

