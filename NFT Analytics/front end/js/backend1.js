    use_name_find_nft_contract_all("0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d") //預設 到時候換掉


    //----------------------------------------------------------------------------------------------//
    //                            用合約地址找SLUG資料之 API function                                 //
    //---------------------------------------------------------------------------------------------// 
    //Use contract address to find the nft slug and contact info(OK)
    function find_slug(contract_address) {
      const options = { method: "GET" }
      return fetch(
        "https://api.opensea.io/api/v1/asset_contract/" + contract_address,
        options
      )
        .then(response => {
          return response.json();
        })
        .catch((err) => console.error(err))
    }



    // //----------------------------------------------------------------------------------------------//
    // //                                用SLUG找詳細資料之 API function                                 //
    // //---------------------------------------------------------------------------------------------//     
    //   var nftslugurl =
    //     "https://api.opensea.io/api/v1/collection/" + nft_slug + "/stats"
    //   const options = { method: "GET", headers: { Accept: "application/json" } }
    //   fetch(nftslugurl, options)
    //     .then(response => response.json())
    //     .then((response) => console.log(response))
    //     .catch((err) => console.error(err))
    


    //----------------------------------------------------------------------------------------------//
    //                                合約找SLUG再找詳細外部資料API function                           //
    //---------------------------------------------------------------------------------------------//     
    async function find_nft_contract_all() {
      var contract_address = document.getElementById("address").value
      const nft_detail_info = await find_slug(contract_address);
      console.log(nft_detail_info);
      ///NAME 
      name=nft_detail_info.name
      name_1 = name.replace(/\s*/g,"");
      console.log(name_1);
      ///SLUG
      nft_slug2 = nft_detail_info.collection.slug 
      ///DISCORD URL
      discord = nft_detail_info.collection.discord_url
      ///TWITTER URL
      if(nft_detail_info.collection.twitter_username==null)
      {
        twitter = 'https://twitter.com/'+name_1
        console.log("No twitter");
      }
      else
      {
        twitter_name = nft_detail_info.collection.twitter_username
        twitter = 'https://twitter.com/'+twitter_name
      }
      ///WEBSITE URL
      website = nft_detail_info.collection.discord_url
      console.log(nft_slug2,discord,twitter,website);
      var nftslugurl =
        "https://api.opensea.io/api/v1/collection/" + nft_slug2 + "/stats"
      const options = { method: "GET", headers: { Accept: "application/json" } }
      fetch(nftslugurl, options)
        .then(response => response.json())
        .then((response) => console.log(response))
        .catch((err) => console.error(err))
      
    }



    //----------------------------------------------------------------------------------------------//
    //                                      名字找詳細Main function                                  //
    //---------------------------------------------------------------------------------------------//    
    async function use_name_find_nft_contract_all(contract_address_by_name) {
      const nft_detail_info = await find_slug(contract_address_by_name);
      console.log(nft_detail_info);

      ///NAME
      name=nft_detail_info.name
      name_1 = name.replace(/\s*/g,"");
      ///SLUG
      nft_slug2 = nft_detail_info.collection.slug 
      ///DISCORD URL
      discord = nft_detail_info.collection.discord_url
      ///TWITTER URL
      if(nft_detail_info.collection.twitter_username==null)
      {
        twitter = 'https://twitter.com/'+name_1
        // console.log("No twitter");
      }
      else
      {
        twitter_name = nft_detail_info.collection.twitter_username
        twitter = 'https://twitter.com/'+twitter_name
      }
      ///WEBSITE URL
      website = nft_detail_info.collection.external_url
      ///show all info
      console.log("address : "+contract_address_by_name);
      console.log("name : "+name_1);
      console.log("slug : "+nft_slug2);
      console.log("discord : "+discord);
      console.log("twitter : "+twitter);
      console.log("website : "+website);

      ///改變按鈕HREF
      document.getElementById("website").href = website;
      document.getElementById("twitter").href = twitter;
      document.getElementById("discord").href = discord;
      document.getElementById("etherscan").href = "https://etherscan.io/address/"+contract_address_by_name;



    }



    //----------------------------------------------------------------------------------------------//
    //                                      名字找合約Main function                                  //
    //---------------------------------------------------------------------------------------------//    
    async function find_nft_contract_by_name()
    {
      var name_to_contract_address = await search_by_name(1)
      // console.log(name_to_contract_address);
      if (name_to_contract_address.total=='0')
      {
        console.log("Some Data Missing!");
      }
      else
      {
        ///address 
        contract_address_by_name = name_to_contract_address.result[0].token_address;
        use_name_find_nft_contract_all(contract_address_by_name);
        gethistoryfp(contract_address_by_name);
        // console.log(contract_address_by_name);///透過名稱去鏈上遍歷找到合約
      }
    }



    //----------------------------------------------------------------------------------------------//
    //                    將nft name名字傳入API找到合約後RETURN回找合約Main function                    //
    //---------------------------------------------------------------------------------------------//    
    function search_by_name()
    {
      var nft_name = document.getElementById("nft_name").value
      var searchapi =
        "https://deep-index.moralis.io/api/v2/nft/search?chain=eth&format=decimal&q=" + nft_name + "&filter=name"
      const options = { method: "GET", headers: { "Accept": "application/json","X-API-Key": "6FAF5fwmYKqG4MZR7xlf5lXYRVGc4wVqsNMBfhC37fJJjEOQVJLWYEZMqaBZFQv7"} }
      return fetch(searchapi, options)
        .then(response => {return response.json()})
        .catch((err) => console.error(err))
    }


    
    //----------------------------------------------------------------------------------------------//
    //                                      找歷史價格Main function                                  //
    //---------------------------------------------------------------------------------------------//
    async function gethistoryfp(address)
    {
      var historyfp = await show_history_FP(address);
      if(historyfp.error_code!=null)
      {
        console.log("No related trading data here!");
      }
      else
      {
        process_json(historyfp) //去做json前處理
      }
    }



    //----------------------------------------------------------------------------------------------//
    //透過find_nft_contract_by_name找到合約，傳到gethistoryfp，再傳來show_history_FP找過去30天Floor Price//
    //---------------------------------------------------------------------------------------------//
    function show_history_FP(address)
    {
      // const currentDay =moment().format('YYYY-MM-DD')
      // let from = moment().subtract(90, 'days').format('YYYY-MM-DD')
      let from = "2022-03-06"
      let currentDay = "2022-04-06"
      // var address="0x82016d4ad050ef4784e282b82a746d3e01df23bf" //暫時的合約  

      var historyfpapi = "https://api.covalenthq.com/v1/1/nft_market/collection/"+address+"/?from="+from+"&to="+currentDay
      return fetch(historyfpapi, {headers:{
        Authorization: "Basic Y2tleV9hZWI0NGQ0YzAwNWU0NTFhOTg4NmVhYTk2OGY6IA=="
      }})
        .then(response => {return response.json()})
        .catch((err) => console.error(err))
    }

    //----------------------------------------------------------------------------------------------//
    //                              剖析API所得JSON檔案並做轉換後重新塞入新的JSON                        //
    //---------------------------------------------------------------------------------------------//    
    function process_json(historyfp)
    {
      // console.log(historyfp);
      var priceXdata =[]
      for(var i = 0; i < 31; i++)
      {
        var newdate = historyfp.data.items[i].opening_date
        var newprice = historyfp.data.items[i].floor_price_quote_7d;
        newdate=newdate.substr(5)
        // console.log(newdate);
        add={day:newdate,floorprice:newprice}
        priceXdata.push(add)
      }
      console.log(JSON.stringify(priceXdata));
      d3.select(window).on("resize", drawdiagram(priceXdata));
    }



    //----------------------------------------------------------------------------------------------//
    //                                              畫圖時間                                         //
    //---------------------------------------------------------------------------------------------//    
    async function drawdiagram(data)
    {
        const parseTime = d3.timeParse('%m-%d')
        for(var x = 0; x < 31; x++)
        {
            data[x].day = parseTime(data[x].day);
        }
        // console.log(data);
        // set the dimensions and margins of the graph
        const width = 700,height = 340;

        // append the svg object to the body of the page
        svg1 = d3.select("#floorpricechartsvg")
        var g=svg1.append("g").attr("transform","translate(40,50)");//在svg中添加一个g标签，并移动到（40，50）
        

        const xScale = d3.scaleTime()
                    .domain(d3.extent(data,function(d){return d.day}))
                    .range([ 0, width ])

        const xAxis = d3.axisBottom(xScale)
                      .tickFormat(d3.timeFormat("%m/%d"))

        g.append("g").attr("transform", `translate(0, ${height})`).call(xAxis).style("color", "white");


        // Add Y axis
        const yScale = d3.scaleLinear()
          .domain([0,d3.max(data,function(d){return d.floorprice})])
          .range([ height, 0 ])

        const yAxis = d3.axisLeft(yScale)

        g.append("g").attr("transform","translate(0,0)").call(yAxis).style("color", "white");


        var line=d3.line()
        .x(function(d){return xScale(d.day)})
        .y(function(d){return yScale(d.floorprice)}).curve(d3.curveLinear);
          
        
        g.append("g")
        .insert("path")
        .attr("d",line(data))
        .attr("stroke","pink")
        .attr("stroke-width","7")
        .attr("fill","none")

        
        g.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx",function(d){return xScale(d.day)})
        .attr("cy",function(d){return yScale(d.floorprice)})
        .attr("r","2").attr("fill","black");                   
    
     }