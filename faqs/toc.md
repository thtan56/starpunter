(setq markdown-xhtml-header-content
      "<style type='text/css'>
img[alt="Homepage"] {
   width: 1200px;
   height: 800px;
}
</style>")

A) How to play
==============

## Table of Content <a name="toc"/>

- [1. Goto Home page](#1-homepage) 
- [2. Open account - Registration](#2-registration)  
- [3. Login to account](#3-login)
- [4. Make a cash deposit](#4-cash-deposit)
- [5. Buy virtual currency](#5-buy-vcash)
- [6. Select a game plan](faqs/readmd.html?fileToRender='60_select_plan.md' "Plan")
  * [6.1 Buy ticket](faqs/readmd.html?fileToRender='61_buy_ticket.md' "BuyTicket")
  * [6.2 Place a bet](faqs/readmd.html?fileToRender='62_place_bet.md' "PlaceBet")
- [7. View my game results](faqs/readmd.html?fileToRender='70_mygame_results.md' "MyGameResults")
- [9. Test css](faqs/readmd.html?fileToRender='testcss.md' "TestCss")

* [Another section](#new-section)    <-- it's called 'Another section' in this list but refers to 'New section'



Paragraphs are separated by a blank line.

2nd paragraph. *Italic*, **bold**, and `monospace`. Itemized lists
look like:

  * this one
  * that one
  * the other one

Note that --- not considering the asterisk --- the actual text
content starts at 4-columns in.

> Block quotes are
> written like so.
>
> They can span multiple paragraphs,
> if you like.

Use 3 dashes for an em-dash. Use 2 dashes for ranges (ex., "it's all
in chapters 12--14"). Three dots ... will be converted to an ellipsis.
Unicode is supported. ☺


[goto details](#detail-section)

# Contents from the 'chapter2.md'

Read more [here](faqs/readmd.html?fileToRender='chapter2.md') # chapter2!

An h2 header
------------

Here's a numbered list:

 1. first item
 2. second item
 3. third item

Note again how the actual text starts at 4 columns in (4 characters
from the left side). Here's a code sample:

    # Let me re-iterate ...
    for i in 1 .. 10 { do-something(i) }

As you probably guessed, indented 4 spaces. By the way, instead of
indenting the block, you can use delimited blocks, if you like:

~~~
define foobar() {
    print "Welcome to flavor country!";
}
~~~

(which makes copying & pasting easier). You can optionally mark the
delimited block for Pandoc to syntax highlight it:

~~~python
import time
# Quick, count to ten!
for i in range(10):
    # (but not *too* quick)
    time.sleep(0.5)
    print i
~~~



### An h3 header ###

Now a nested list:

 1. First, get these ingredients:

      * carrots
      * celery
      * lentils

 2. Boil some water.

 3. Dump everything in the pot and follow
    this algorithm:

        find wooden spoon
        uncover pot
        stir
        cover pot
        balance wooden spoon precariously on pot handle
        wait 10 minutes
        goto first step (or shut off burner when done)

    Do not bump wooden spoon or it will fall.

Notice again how text always lines up on 4-space indents (including
that last line which continues item 3 above).

Here's a link to [a website](http://foo.bar), to a [local
doc](local-doc.html), and to a [section heading in the current
doc](#an-h2-header). Here's a footnote [^1].

[^1]: Footnote text goes here.

Tables can look like this:

size  material      color
----  ------------  ------------
9     leather       brown
10    hemp canvas   natural
11    glass         transparent

Table: Shoes, their sizes, and what they're made of

## Hello Section<a name="hello"></a> [Back](#toc)  
(The above is the caption for the table.) Pandoc also supports
multi-line tables:

--------  -----------------------
keyword   text
--------  -----------------------
red       Sunsets, apples, and
          other red or reddish
          things.

green     Leaves, grass, frogs
          and other things it's
          not easy being.
--------  -----------------------
# <a name="detail-section"></a> 9) DETAIL SECTION

A horizontal rule follows.

***

Here's a definition list:

apples
  : Good for making applesauce.
oranges
  : Citrus!
tomatoes
  : There's no "e" in tomatoe.

Again, text is indented 4 spaces. (Put a blank line between each
term/definition pair to spread things out more.)

Here's a "line block":

| Line one
|   Line too
| Line tree

and images can be specified like so:

![example image](faqs/example-image.jpg "An exemplary image")

Inline math equations go in like so: $\omega = d\phi / dt$. Display
math should get its own line and be put in in double-dollarsigns:

$$I = \int \rho R^{2} dV$$

And note that you can backslash-escape any punctuation characters
which you wish to be displayed literally, ex.: \`foo\`, \*bar\*, etc.

<div id="hello-world"/>

# <a name="1-homepage"></a> 1) Home Page
* [:house:](#toc)
[:arrow_forward:](#2-registration)

1)The home page is similar for public and login user.

![Homepage](faqs/homepage.png "home page image")


<div style="text-align: left">
<img src="/faqs/homepage.png" width="1200" /></div>

A)  Plan (or Game Plan)

1)  The home page shows the plans available to participate.

•  This week, there are 4 different plans available ie $10, $20, $25 and $50 plans.

2)  To join a plan, you have to buy a ticket for the chosen plan.

•  When a participant buys a plan, the money will be deducted from his account.
•  As such you need to deposit money into your account first.

3)  a $25 plan (entry cost) may has a quorum of 2 (head to head) 
to 50 or more entrants (group)

•  the name ‘pool’ and ‘plan’ are the same and interchangeable

•  the pool type is either ‘head to head’ or ‘group’

•  other information in the pool are payout (top 1, 2, etc), pool prize.
B)  Entrants
•  This section shows the participants for current week and the plan bought (column 3)

•  Beside the plan number, it shows the number of games selected for betting by the participant.

C)  Leadership Board
This board displays the betting score and income by participants for the week.

D)  Game Board
This displays the matches playing for this week.


# <a name="2-registration"></a> 2) Registration / Sign up
* [:house:](#toc)
[:arrow_backward:](#1-homepage) 
[:arrow_forward:](#3-login)* 




## New section <a name="new-section" />

## Using emoji








# <a name="3-login"></a> 3) Login / Sign in
* [:house:](#toc) 
[:arrow_backward:](#2-registration) 
[:arrow_forward:](#4-cash-deposit) 

## New section <a name="new-section" />

## Using emoji

dsfgdsfg



# <a name="4-cash-deposit"></a> 4) Make a cash deposit
* [:house:](#toc) 
[:arrow_backward:](#3-login) 
[:arrow_forward:](#5-buy-vcash) 

## New section <a name="new-section" />

## Using emoji






# <a name="5-buy-vcash"></a> 5) Buy virtual currency
* [:house:](#toc) 
[:arrow_backward:](#4-cash-deposit) 
[:arrow_forward:](#6-select-plan) 


@octocat :+1: This PR looks great - it's read to merge! :shipit:

```md
this is a :smile: smile emoji
```

this is a :smile: smile emoji
:fireworks:

## Tables

Colons can be used to align columns

| Tables    | Are   | Cool |
| --------- |:-----:| ----:|
| col 3 is  | right-aligned | $1600 |
| col 2 is  | centered      | $12 |
| zebra stripes  | are neat | $1 |

## Auto links

http://localhost/test/showdown.html


