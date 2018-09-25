# [Best Clip Of The Week](https://www.bestclipoftheweek.com/)

## An ASP.NET Core 2.1 Web App

[![codecov](https://codecov.io/gh/Reptarsrage/bestClipOfTheWeek/branch/master/graph/badge.svg)](https://codecov.io/gh/Reptarsrage/bestClipOfTheWeek)
[![Build status](https://ci.appveyor.com/api/projects/status/4ntsr4sl2vey3krf?svg=true)](https://ci.appveyor.com/project/Reptarsrage/bestclipoftheweek)

## Description

This is my attempt to tally the results of StoneMountain64's Best Clip of the Week videos.

This site is not meant for a wide range of users. Mostly just one, although now
that I've made it I possibly see a little room for growth. My intention was to
have a program that took a YouTube url and a list of terms and returned a count of votes
for each term by sifting through the video comments. After I completed this I thought,
'wouldn't it be cool if I could play with the terms, store them and manipulate them?'
Well this whim lead to a backend server and a service running on Azure. Then I thought,
wouldn't it be cool if I had some charts? Luckily I was already using Youtube Data and
Analytics, and Google+ API's, so adding Google Charts was not difficult. Then I figured since I
have a database that may or may not charge me money for heavy use, I need some
security. This drove me to implement a login system.

After all that was said and done, I had kind of this clunky cool looking website.
There are a couple of things that I haven't gotten to yet. The biggest one is
improving the load time of the results. Client-side processing, slow google API's
and zero caching have all added up to a whopping 90+sec data load time... and
unless I want to spend money on more storage, I'm not sure how to improve
this. There is also the issue with errors cropping up. I didn't write unit
tests as this was just kind of an ad-hoc fun project and I didn't want to deal
with the overhead. There are some pretty heavy restrictions on my back-end server
size, the amount of API calls I can make, and a few other limiting factors.
There are some errors with showing/hiding loading and error messages that still
need to be worked out. There are many moving lient-side pieces here, and if one fails the
site doesn't work, it would be nice to come up with a solution for this as well.

I had a super fun time making this site. Flaws and all I think it turned out pretty well.

## Credits

- API's
  - [Google Charts](https://developers.google.com/chart/) for all your well-documented charting needs.
  - [YouTube Analytics and Reporting APIs](https://developers.google.com/youtube/analytics/) fetches YouTube stats, and much more.
  - [YouTube Data API](https://developers.google.com/youtube/v3/) parses YouTube comments, and much much more.
  - [Google+ Data API](https://developers.google.com/+/api/) parses Google+ comments, and much much much more.
- Images
  - [Murray Smith](http://stackoverflow.com/questions/14446677/how-to-make-3-corner-rounded-triangle-in-css) for the most perfect triangle ever conceived.
  - [Michal Kučera](https://www.iconfinder.com/icons/401329/help_info_information_support_tip_tooltip_icon) for a fancy tool-tip image.
  - [This site](http://pixshark.com/spinner-gif-transparent-background.htm) for not the best loading image, but certainly the easiest to find.
- Special Thanks
  - [Jquery](https://jquery.com/) library quite a revolutionary and free library.
  - [Jquery UI](https://jqueryui.com/) library which was pretty damn usefull for them tooltips.
  - [JSColor](http://jscolor.com/) a SICK color chooser.
  - [nnattawat](http://nnattawat.github.io/flip/) for that ballin' flip animation.
  - [OpenShift](https://www.openshift.com/) for hosting my SQL server and old PHP service for awhile.
  - [x10hosting.com](https://x10hosting.com/) for hosting my site for free for awhile.
  - [Microsoft Azure](https://azure.microsoft.com/) for hosting my site currently.
  - [BootStrap](http://getbootstrap.com/) for making my site sexier.
  - [CSS Menu Maker](http://cssmenumaker.com/menu/responsive-menu-bar) for my stupidly classy old header bar.
  - [W3Scools](http://www.w3schools.com/) my sensei.
  - [phpfiddle](http://phpfiddle.org/) for an easy solution to php programming.
  - [StoneMountain64](https://www.youtube.com/channel/UCN-v-Xn9S7oYk0X2v1jx1Qg) for kickin shit and eatin snakes.

## TODO

- [x] Drop PHP/MySql service layer and use Enterprise Library & SQL Server
- [x] Migrate site to Net Core 2.0
- [x] Update site to SSL
- [x] Add Application Insights
- [x] Migrate site to Net Core 2.1
- [x] Improve YouTube & Google+ comment parsing logic to avoid so many missed comments
- [x] Add Unit tests
- [x] Set up a deployment pipeline (Appveyor/Github/CodeCov)
- [x] Update Pie chart controls
- [ ] Add site logging to Splunk & Datadog
- [ ] Add Integration tests
- [ ] Move client side logic to server side with caching & storage
- [ ] Add form validation
- [ ] Add animation
- [ ] Add Error handeling
- [ ] Add Splash home page
- [ ] About
- [ ] Contact
- [ ] SEO
- [ ] Localization
- [ ] [Accessibility](https://www.w3.org/WAI/standards-guidelines/aria/)

## Useful Notes

### Docker ([docs](https://docs.docker.com/engine/reference/commandline/docker/))

Build docker container

```sh
docker build -t bestclipoftheweek:latest .
```

Run docker container

```sh
docker run -it -p 5000:5000 -p 80:80 -e ASPNETCORE_URLS='http://*:5000' bestclipoftheweek:latest
```

### User Secrets ([docs](https://docs.microsoft.com/en-us/aspnet/core/security/app-secrets))

Set multiple secrets

```sh
type .\input.json | dotnet user-secrets set
```

Set secret

```sh
dotnet user-secrets set <NAME> <VALUE>
```

Lsit secrets

```sh
dotnet user-secrets list
```

### Entity Framework ([docs](https://docs.microsoft.com/en-us/ef/core/miscellaneous/cli/dotnet))

Update the database to a specified migration

```sh
dotnet ef database update --project .\src\BestClipOfTheWeek\BestClipOfTheWeek.csproj --startup-project .\src\BestClipOfTheWeek\BestClipOfTheWeek.csproj
```

Drop the database

```sh
dotnet ef database drop --project .\src\BestClipOfTheWeek\BestClipOfTheWeek.csproj --startup-project .\src\BestClipOfTheWeek\BestClipOfTheWeek.csproj
```

Add a new migration

```sh
dotnet ef migrations add <NAME> --project .\src\BestClipOfTheWeek\BestClipOfTheWeek.csproj --startup-project .\src\BestClipOfTheWeek\BestClipOfTheWeek.csproj
```

### npm ([docs](https://nodejs.org/en/download/package-manager/))

To install on Linux run

```sh
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install -y nodejs
node --version
```

To install on Windows run

```ps
choco install -y nodejs.install
refreshenv
node --version
```

### yarn ([docs](https://yarnpkg.com/lang/en/docs/install/))

To install on Linux run

```sh
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt-get update && sudo apt-get install yarn
yarn --version
```

To install on Windows run

```ps
choco install -y yarn
refreshenv
yarn --version
```

### Set up Third-Party Authentication ([docs](https://docs.microsoft.com/en-us/aspnet/core/security/authentication/social/index))

Follow instructions in the docs.

## Support

Feel free to contact me directly with any questions or concerns related to the site. I'm definitely open to criticism, ideas, suggestions and even more open to praise.

[Contact me](mailto:justinprobb@gmail.com)
