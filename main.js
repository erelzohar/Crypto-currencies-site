/// <reference path="jquery-3.5.1.js" />
/// <reference path="jquery-ui.min.js" />

"use strict";

import {
    getDataAsync,
    moreInfo,
    addCheckMark,
    StorageCheckAndDisplayAsync,
    addAndDeleteFromReport,
    cardBuilder
} from "./functions.js";

$(() => {

    const rellax = new Rellax(".rellax");
    const searchArray = [];

    //get Ajax json and append to container.
    $(async () => {

        $("#container").html(`<img id="loadingGif" src="assets/images/loading.gif">`);

        try {
            const coinListArray = await getDataAsync(`https://api.coingecko.com/api/v3/coins/list`);
            let coinListHtml = "";
            for (let i = 1; i <= 100; i++) {
                searchArray.push(coinListArray[i].symbol);
                coinListHtml += cardBuilder(i, coinListArray);
            }

            $("#container").html(coinListHtml);
            moreInfo(coinListArray);
            addCheckMark();
            addAndDeleteFromReport(coinListArray);

            //home btn function
            $("#pills-home-tab").click(() => {
                $("#searchBox").val("");
                $("#container").html(coinListHtml);
                moreInfo(coinListArray);
                addCheckMark();
                addAndDeleteFromReport(coinListArray);
            });

            //append searched coin to container
            $("#searchBtn").click(() => {
                for (let i = 1; i <= 100; i++) {
                    if ($("#searchBox").val() === coinListArray[i].symbol) {
                        $("#container").html(cardBuilder(i, coinListArray));
                        StorageCheckAndDisplayAsync(i, coinListArray);
                        addCheckMark();
                        addAndDeleteFromReport(coinListArray);
                    }
                }
                //search validation
                if ($("#container").html() === coinListHtml || $("#searchBox").val() === "") {
                    alert("Not found please try again...");
                }
            });

            //jquery ui autocomplete :
            $("#searchBox").autocomplete({
                source: searchArray
            }, {});
            
            //reports page build
            $("#pills-profile-tab").click(() => {
                $("#searchBox").val("");
                let reportsHtml = null;
                if (localStorage.getItem("reportsArray") !== null && JSON.parse(localStorage.getItem("reportsArray")).length !== 0) {
                    console.log(JSON.parse(localStorage.getItem("reportsArray")).length);
                    console.log(localStorage.getItem("reportsArray") );
                    const reportsArray = JSON.parse(localStorage.getItem("reportsArray"));
                    reportsArray.forEach(element => reportsHtml += cardBuilder(element.id, coinListArray));
                    $("#container").html(reportsHtml);
                    moreInfo(coinListArray);
                    addCheckMark();
                    addAndDeleteFromReport(coinListArray);
                    return;
                }
                    $("#container").html(`<h1 id="noReportsText">You haven't added any coin to your reports.</h1>`);
            });
            //about us page build
            $("#pills-contact-tab").click(() => {
                $("#searchBox").val("");
                $("#container").html(
                    `<h2 class="col-xs-10" id="aboutText">
                        Name : Erel Zohar <br>
                        Titles: <br>
                        Director and owner at Cryptuna,<br>
                        Sergant at Vietnam war,<br>
                        Obama's BFF,<br>
                        The next Bill Gates.
                    </h2>`
                );
            });

        }
        catch (err) { alert("Error : " + err.message); }
    })

});
