Just a tutorial I was checking out, now added some simple game project and tested out github pages.

Be warned, if you enable Jekyl on the page, suddenly it overwrites your readme.md file, and if you are currently editing the file, and trie to commit the file after the jekyl setting has comitted to it, your changes are magically lost, silently, poof.

Nup! What happens is it dumps the jekyl in a new branch, gh-pages, and it has an index.md file tjere with the jekyl content.
(Just merge it from master/main and adjust the github pages settungs from within github settings to use the master/main branch).

Anyways, guide from scratch

- Create account on github
- Create repo on your account
- Add a readme.md file if you like (optional)
- Create an index.html file (preferrably with this name), or another name if you don't mind writing a longer url to your github pages page.
- Put som valid html in the file, like 
```html
<html>
<body>
<h1>Hello</h1>
</body>
</html>
```
- Commit/save changes in file
- Go to settings of repo
- Scroll down and select 'Pages'
- Select master from dropdown
- Skip Jekyl, and I assume you want to skip licence also, but that is up to you.
- Click save
- Wait a little while, and the url for the page will be shown , something like https://codelaxx.github.io/snasenwebsite/ , but with your username in the start of the url, and your repo name in the end of the url. If you didn't use index.html for your file name, you will have to add that after the last / to open that file (index.html is opened by default by browsers so that's why you don't have to put that in the url, but you can test it here and it will work like https://codelaxx.github.io/snasenwebsite/index.html)

Tada, you are online with your page or pages

Now create a new repo and play arround with Jekyl with a pretty template or five (and change template after you have created your page, just to see how good it may look).

note about adsens
using fastname or similar domain services, where you don't want to admin your own dns, you often select forward for your personal domain to point to your github pages for example. When you use cloak on the forward, your www.example.com will look like it is actually there, ie, when you open it and use debugging in your browser to open the index.html file, it will show your embedded adsense id etc in the head tag. However, if you enter www.example.com/index.html, it wil show you the real html file, which is a near empty html file on the fastname servers, which contains an oldfashioned frame/iframe that embeds the github pages, and such "hides" or obfuscates what server you are actually surfing on. This is why adsense/google crawlers don't find your adsense codes, they use the actual www.example.com/index.html file, and thus only se a simple html page with an iframe and link for content, and they don't follow the link. So, change from cloak to forward, and you should be fine. HOWEVER, google has some policy about forwarding traffic, but I hope this sort of forward is ok. It was mentioned that a 301 http status code, "moved permanently", would be fine, but this needs to be checked out, verified, and check that fastname does a 301. Better yet, open a supportticket for fastname, pointing to the actuall page, but again, that will root to the root of github pages, and adsens don't even like subdomains such as mysite.example.com, so that may also be a problem. We'll see and research more.
