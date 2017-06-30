/**
 * Created by qyy on 2017/3/26.
 */
var page=1;
var rowNum=5;
var colomnNum=4;
var filterFlag;
var totalPageNum=1;
var filterXhr=new XMLHttpRequest();
window.addEventListener("load",function () {
    initialFilter(rowNum, colomnNum);
    initialSelect();
    filterPicsDisplay("AF", "continent", (page-1)*rowNum*colomnNum, rowNum*colomnNum);
    initialImgHref();
    initialFilterButton();
    initialPageTurner();

    pageTurnerTrans();
});

function filterSendRequest(name, type, start, num) {
    filterXhr.open("get", "php/filter.php?"+bindDemands(changeDemand("type", type), changeDemand("name", name), changeDemand("start", start), changeDemand("num", num)));
    filterXhr.send(null);
}

function initialFilter(pNum, imgNum) {
    var filterStage=document.getElementById("filterStage");
    var picsStage=document.getElementById("pics");

    for(var i=0; i<pNum; i++){
        var paragraph=document.createElement("p");

        for(var j=0; j<imgNum; j++){
            var img=document.createElement("img");
            paragraph.appendChild(img);
        }

        picsStage.appendChild(paragraph);
    }

}

function initialSelect() {
    var city_sel=document.getElementById("city_sel");
    var country_sel=document.getElementById("country_sel");
    var continent_sel=document.getElementById("continent_sel");

    fetch("php/filterSelect.php?type=get_continent_list").then(function(rsp) {
        return rsp.text();
    }).then(function(data) {
        console.log(data);
        data = JSON.parse(data);

        while (continent_sel.firstChild) {
            continent_sel.removeChild(continent_sel.firstChild);
        }
        data.forEach(function(continent) {
            var opt = document.createElement("option");
            opt.setAttribute("value", continent.ContinentCode);
            opt.appendChild(document.createTextNode(continent.ContinentName));
            continent_sel.appendChild(opt);
        });

        countryOptionChange(continent_sel.value);
        cityOptionChange(country_sel.value);
    });

    function countryOptionChange(continent) {
        fetch("php/filterSelect.php?type=get_country_list&continent="+continent).then(function(rsp) {
            return rsp.text();
        }).then(function(data) {
            data = JSON.parse(data);

            while (country_sel.firstChild) {
                country_sel.removeChild(country_sel.firstChild);
            }

            let optEmpty=document.createElement("option");
            optEmpty.value="";
            optEmpty.appendChild(document.createTextNode(""));
            country_sel.appendChild(optEmpty);

            data.forEach(function(country) {
                let opt = document.createElement("option");
                opt.setAttribute("value", country.ISO);
                opt.appendChild(document.createTextNode(country.CountryName));
                country_sel.appendChild(opt);
            });

            cityOptionChange(country_sel.value);
        });

    }

    function cityOptionChange(country) {
        fetch("php/filterSelect.php?type=get_city_list&country="+country).then(function(rsp) {
            return rsp.text();
        }).then(function(data) {
            data = JSON.parse(data);

            while (city_sel.firstChild) {
                city_sel.removeChild(city_sel.firstChild);
            }

            let optEmpty=document.createElement("option");
            optEmpty.value="";
            optEmpty.appendChild(document.createTextNode(""));
            city_sel.appendChild(optEmpty);
            data.forEach(function(city) {
                let opt = document.createElement("option");
                opt.setAttribute("value", city.GeoNameID);
                opt.appendChild(document.createTextNode(city.AsciiName));
                city_sel.appendChild(opt);
            })
        });
    }

    continent_sel.addEventListener("change", function () {
        countryOptionChange(continent_sel.value);
    }, true);
    country_sel.addEventListener("change", function () {
        cityOptionChange(country_sel.value);
    }, true);
}

function initialFilterButton() {
    var filterButton=document.getElementById("filterButton");

    filterButton.addEventListener("click", function () {
        page=1;
        filterFlag=true;
        requestPic();
    },true);
}

function initialPageTurner() {
    if(totalPageNum<=5){
        changePagination(1, totalPageNum);
    }else{
        changePagination(1,5);
    }
}

function requestPic() {
    var city_sel=document.getElementById("city_sel");
    var country_sel=document.getElementById("country_sel");
    var continent_sel=document.getElementById("continent_sel");
    if(country_sel.value==""){
        filterSendRequest(continent_sel.value, "continent", (page-1)*rowNum*colomnNum, rowNum*colomnNum);
    }else if(city_sel.value==""){
        filterSendRequest(country_sel.value, "country", (page-1)*rowNum*colomnNum, rowNum*colomnNum);
    }else{
        filterSendRequest(city_sel.value, "city", (page-1)*rowNum*colomnNum, rowNum*colomnNum);
    }
}

function changePagination(start, end) {
    var pages=document.getElementById("pages");

        while(pages.firstChild){
            pages.removeChild(pages.firstChild);
        }

        for(var i=start-1; i<end; i++){
            var pageBt=document.createElement("a");
            pageBt.id="page"+(i+1);
            pageBt.dataset.index=i+1;
            pageBt.style.cursor="pointer";
            pageBt.innerText=i+1;
            pageBt.addEventListener("click", function () {
                var city_sel=document.getElementById("city_sel");
                var country_sel=document.getElementById("country_sel");
                var continent_sel=document.getElementById("continent_sel");
                page=this.dataset.index;
                resetPage(totalPageNum);
                updatePage(page);
                requestPic();
            }, true);

            pages.appendChild(pageBt);
        }

    resetPage(totalPageNum);
    updatePage(page);
}

function filterPicsDisplay(name, type, start, num) {
    var picsStage=document.getElementById("pics");
    var imgs=picsStage.getElementsByTagName("img");

    filterSendRequest(name, type, start, num);
    filterXhr.onload=function () {
        console.log(filterXhr.responseText);
        var pics=JSON.parse(filterXhr.responseText.split("&")[0]);
        for (var i=0; i<rowNum*colomnNum; i++) {
            imgs[i].src = "";
            imgs[i].dataset.imageid = 0;
        }

        if(pics.length!=0) {
            for (var i in pics) {
                imgs[i].src = "img/travel-images/square-medium/" + pics[i][1];
                imgs[i].dataset.imageid = pics[i][0];
            }
        }

        var picTotalNum=filterXhr.responseText.split("&")[1];
        totalPageNum=parseInt(picTotalNum/(rowNum*colomnNum))+(picTotalNum%(rowNum*colomnNum)==0?0:1);
        if(filterFlag) {
            initialPageTurner();
        }

    };
}

function pageTurnerTrans() {
    var back=document.getElementById("back");
    var forward=document.getElementById("forward");

    back.addEventListener("click", function () {
        if(page!==1){
            page--;
            if(page-5>0) {
                changePagination(page-4, page);
            }else if(page>0){
                initialPageTurner();
            }else{
                page++;
            }

            requestPic();
        }
    }, true);

    forward.addEventListener("click", function () {
        if(page!==totalPageNum){
            page++;
            if(page+5<=totalPageNum){
                changePagination(page,page+4);
            }else{
                    if (totalPageNum <= 5) {
                        changePagination(1, totalPageNum);
                    } else {
                        changePagination(totalPageNum - 4, totalPageNum);
                    }
            }

            requestPic();
        }
    }, true);
}

function resetPage() {
    var pages=document.getElementById("pages").getElementsByTagName("a");

    for(var j=0;j<pages.length;j++){
        pages[j].style.color="indigo";
        pages[j].style.backgroundColor="transparent";
    }
}

function updatePage(index) {
    var pageChoose=document.getElementById("page"+(index));

    pageChoose.style.backgroundColor="indigo";
    pageChoose.style.color="azure";
}



