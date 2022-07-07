'use strict';

const templates = {
  articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
  articleTagsLink: Handlebars.compile(document.querySelector('#template-article-tags-link').innerHTML),
  authorLink: Handlebars.compile(document.querySelector('#template-author-link').innerHTML),
  tagCloudLink: Handlebars.compile(document.querySelector('#template-tag-cloud-link').innerHTML),
  authorCloudLink: Handlebars.compile(document.querySelector('#template-author-cloud-link').innerHTML)
}

const optArticleSelector = '.post',
  optTitleSelector = '.post-title',
  optTitleListSelector = '.titles',
  optArticleTagsSelector = '.post-tags .list',
  optArticleAuthorSelector = '.post-author',
  optTagsListSelector = '.tags.list',
  optAuthorsListSelector = '.authors.list',
  optCloudClassCount = 5,
  optCloudClassCountPrefix = 'tag-size-'

function titleClickHandler(event){
  event.preventDefault();
  const clickedElement = this;
  console.log('Link was clicked!');

  /* [DONE] remove class 'active' from all article links  */

  const activeLinks = document.querySelectorAll('.titles a.active');

  for(let activeLink of activeLinks){
    activeLink.classList.remove('active');
  }

  /* [DONE] add class 'active' to the clicked link */
    
  clickedElement.classList.add('active');
  console.log('clickedElement:', clickedElement);

  /* [DONE] remove class 'active' from all articles */

  const activeArticles = document.querySelectorAll('.posts article.active');

  for(let activeArticle of activeArticles){
    activeArticle.classList.remove('active');
  }

  /* [DONE] get 'href' attribute from the clicked link */

  const articleSelector = clickedElement.getAttribute('href');
  console.log(articleSelector);

  /* [DONE] find the correct article using the selector (value of 'href' attribute) */

  const targetArticle = document.querySelector(articleSelector);
  console.log(targetArticle);

  /* [DONE] add class 'active' to the correct article */

  targetArticle.classList.add('active');
  console.log('Article is visible');
}

function generateTitleLinks(customSelector = ''){
  console.log('Title Lists are just generated');

  /* [DONE] remove contents of titleList */
  const titleList = document.querySelector(optTitleListSelector);
  titleList.innerHTML = '';

  /* for each article */
  const articles = document.querySelectorAll(optArticleSelector + customSelector);
  let html = '';

  for(let article of articles){
    /* get the article id */
    const articleId = article.getAttribute('id');
    console.log(articleId);

    /* find the title element */
    /* get the title from the title element */
    const articleTitle = article.querySelector(optTitleSelector).innerHTML;

    /* create HTML of the link */
    //const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';
   	const linkHTMLData = {id: articleId, title: articleTitle};
	const linkHTML = templates.articleLink(linkHTMLData);
	console.log('HTML of link was created!');

    /* insert link into titleList */
    html = html + linkHTML;
    console.log(html);
  }

  titleList.innerHTML = html;
  
  const links = document.querySelectorAll('.titles a');
  console.log('what is it?');
  for(let link of links){
    link.addEventListener('click', titleClickHandler);
    console.log(link);
  }
}

generateTitleLinks();

function calculateTagsParams(tags){
	
    const params = {
      max:0,
      min:999999
    }
	
	for(let tag in tags){
		console.log(tag + ' is used ' + tags[tag] + ' times ');
		
		params.max = Math.max(tags[tag], params.max);
		params.min = Math.min(tags[tag], params.min);
	}
		
	return params;
}

function calculateTagClass(count, params){
	 
	const normalizedCount = count - params.min;
 	console.log('normalizedCount:', normalizedCount)

	const normalizedMax = params.max - params.min;
	console.log('normalizedMax:', normalizedMax)

	const percentage = normalizedCount / normalizedMax;

	const classNumber = Math.floor(percentage * (optCloudClassCount - 1) + 1);

  return optCloudClassCountPrefix + classNumber;
}

function generateTags(){
	
  /* [NEW] create a new variable allTags with an empty object */
	let allTags = {};
	
  /* find all articles */
	const articles = document.querySelectorAll(optArticleSelector);
	
  /* START LOOP: for every article: */
	for(let article of articles) {
		
	
    /* find tags wrapper */
	const titleList = article.querySelector(optArticleTagsSelector);
		
    /* make html variable with empty string */
	let html = '';
		
    /* get tags from data-tags attribute */
	const articleTags = article.getAttribute('data-tags');
	console.log(articleTags);
	
    /* split tags into array */
	const articleTagsArray = articleTags.split(' ');
	console.log(articleTagsArray);
		
    /* START LOOP: for each tag */
		for(let tag of articleTagsArray){
		console.log(tag);
		
      /* generate HTML of the link */
		
		// const taglinkHTML = '<li><a href="#tag-' + tag + '"><span>' + tag + '</span></a></li>';
		const taglinkHTMLData = {id: articleTags, title: tag};
		const taglinkHTML = templates.articleTagsLink(taglinkHTMLData);
		console.log(taglinkHTML);
			
      /* add generated code to html variable */
		html = html + taglinkHTML;
    	console.log(html);
			
      /* [NEW] check if this link is NOT already in allTags */
      if(!allTags.hasOwnProperty(tag)){
        /* [NEW] add tag to allTags object */
        allTags[tag] = 1;
      } else {
	  	allTags[tag]++;
	  }
			
    /* END LOOP: for each tag */
		}
    /* insert HTML of all the links into the tags wrapper */
	titleList.innerHTML = html;
		
  /* END LOOP: for every article: */
	}
	
  /* [NEW] find list of tags in right column */
	const tagList = document.querySelector(optTagsListSelector);

  	const tagsParams = calculateTagsParams(allTags);
  	console.log('tagsParams:', tagsParams)
	
  /* [NEW] create variable for all links HTML code */
	// let allTagsHTML = '';
	
	const allTagsData = {tags: []};
	
  /* [NEW] START LOOP: for each tag in allTags: */
	for(let tag in allTags){
		/* [NEW] generate code of a link and add it to allTagsHTML */
		
    // allTagsHTML += `<li><a href="#tag-${tag}" class="${calculateTagClass(allTags[tag], tagsParams)}"><span>${tag}</span></a></li> `; 

	allTagsData.tags.push({
  	tag: tag,
  	count: allTags[tag],
  	className: calculateTagClass(allTags[tag], tagsParams)
	});	
		
  /* [NEW] END LOOP: for each tag in allTags: */
	}
	
  /* [NEW] add html from allTagsHTML to tagList */
	tagList.innerHTML = templates.tagCloudLink(allTagsData);
	console.log(allTagsData);
	
}

generateTags();

function tagClickHandler(event){
  /* [DONE] prevent default action for this event */

  event.preventDefault();

  /* [DONE] make new constant named "clickedElement" and give it the value of "this" */

  const clickedElement = this;
  console.log(clickedElement);

  /* [DONE] make a new constant "href" and read the attribute "href" of the clicked element */

  const href = clickedElement.getAttribute('href');
  console.log(href);

  /* [DONE] make a new constant "tag" and extract tag from the "href" constant */

  const tag = href.replace('#tag-', '');
  console.log('tag: ', tag);

  /* [DONE] find all tag links with class active */

  const activeTagLinks = document.querySelectorAll('a.active[href^="#tag-"]');
  console.log(activeTagLinks);

  /* [DONE] START LOOP: for each active tag link */

  for(let activeTagLink of activeTagLinks){
/* [DONE] remove class active */

      activeTagLink.classList.remove('active');

  /* [DONE] END LOOP: for each active tag link */
  }

  /* [DONE] find all tag links with "href" attribute equal to the "href" constant */
  
  const sameTagLinks = document.querySelectorAll('a[href="' + href + '"]');
  console.log(sameTagLinks);

  /* [DONE]  START LOOP: for each found tag link */

  for(let sameTagLink of sameTagLinks){

    /* [DONE]  add class active */

    sameTagLink.classList.add('active');
    console.log(sameTagLink);

  /* [DONE] END LOOP: for each found tag link */

  }
  
    /* execute function "generateTitleLinks" with article selector as argument */

generateTitleLinks('[data-tags~="' + tag + '"]');

}

function addClickListenersToTags(){
  /* [DONE] find all links to tags */

  const allTagsLinks = document.querySelectorAll('a[href^="#tag-"]');

  /* [DONE] START LOOP: for each link */

  for(let allTagsLink of allTagsLinks){

    /* [DONE]add tagClickHandler as event listener for that link */

    allTagsLink.addEventListener('click', tagClickHandler);

  /* [DONE] END LOOP: for each link */
  }

}

addClickListenersToTags();

function generateAuthors (){
	
	let allSideAuthors = { };
	
	/* find all articles */
	const articles = document.querySelectorAll(optArticleSelector);
	console.log(articles);
	
	    /* [DONE] START LOOP: for every article: */
    
    for(let article of articles){
    
      /* [DONE] find author wrapper */
    
      const authorWrapper = article.querySelector(optArticleAuthorSelector);
      console.log(authorWrapper);
      
      /* [DONE] make html variable with empty string */
    
      let html = '';
    
      /* [DONE] get author from data-author attribute */
    
      const articleAuthor = article.getAttribute('data-author');
      console.log(articleAuthor);
    
      /* [DONE] generate HTML of the link */
    
      // const linkHTMLData = '<a href="#author-'+ articleAuthor +'">' + 'by ' + articleAuthor +'</a>';
    	const linkHTMLData = {id: 'author-' + articleAuthor, title: articleAuthor};
		const authorlinkHTMLTemplate = templates.authorLink(linkHTMLData);
      /* [DONE] add generated code to html variable */
    
      html = html + authorlinkHTMLTemplate;
      console.log(html);
    
	  if(!allSideAuthors.hasOwnProperty(articleAuthor)){
      	allSideAuthors[articleAuthor] = 1;
    	} else {
      	allSideAuthors[articleAuthor]++;
    	}		

      /* [DONE] insert HTML of all the links into the author wrapper */
    
      authorWrapper.innerHTML = html;
    
      /* [DONE] END LOOP: for every article: */
    }
	
	/* [NEW] find list of authors in right column */

  const authorRightList = document.querySelector(optAuthorsListSelector);
  
  /* [NEW] create variable for all links HTML code */

  // let allSideAuthorsHTML = '';
  
	const allSideAuthorsData = {authors: []};
	
  /* [NEW] START LOOP: for each author in allSideAuthors */

  for(let articleAuthor in allSideAuthors){
    /* [NEW] generate code of a link and add it to allSideAuthorsHTML */

    //allSideAuthorsHTML += `<li><a href="#author-${articleAuthor}">${articleAuthor} ( ${allSideAuthors[articleAuthor]} )</a></li>`;

	  allSideAuthorsData.authors.push({
	  	author: articleAuthor,
		  count: allSideAuthors[articleAuthor]
	  })
	  
  }
  
     /* [NEW] add html from allSideAuthorsHTML to authorRightList */

  authorRightList.innerHTML = templates.authorCloudLink(allSideAuthorsData);
}

generateAuthors();
    

function authorClickHandler(event){
  /* [DONE] prevent default action for this event */

  event.preventDefault();

  /* [DONE] make new constant named "clickedElement" and give it the value of "this" */

  const clickedElement = this;
  console.log(clickedElement);
	
	/* [DONE] make a new constant "href" and read the attribute "href" of the clicked element */

  const href = clickedElement.getAttribute('href');
  console.log(href);

  /* [DONE] make a new constant "author" and extract tag from the "href" constant */

  const author = href.replace('#author-', '');
  console.log(author);

  /* [DONE] find all author links with class active */

  const activeAuthorLinks = document.querySelectorAll('a.active[href^="#author-"]');
  console.log(activeAuthorLinks);

  /* [DONE] START LOOP: for each active author link */

  for(let activeAuthorLink of activeAuthorLinks){

    /* [DONE] remove class active */

      activeAuthorLink.classList.remove('active');

  /* [DONE] END LOOP: for each active author link */
  }
  
  /* [DONE] find all author links with "href" attribute equal to the "href" constant */
  
  const authorLinks = document.querySelectorAll('a[href="' + href + '"]');
  console.log(authorLinks);

  /* [DONE]  START LOOP: for each found author link */

  for(let authorLink of authorLinks){

    /* [DONE]  add class active */

    authorLink.classList.add('active');
    console.log(authorLink);

  /* [DONE] END LOOP: for each found author link */

  }

  /* execute function "generateTitleLinks" with article selector as argument */

generateTitleLinks('[data-author="' + author + '"]');

  }

function addClickListenersToAuthors(){
  /* [DONE] find all links to authors */

  const allAuthorsLinks = document.querySelectorAll('a[href^="#author-"]');

  /* [DONE] START LOOP: for each link */

  for(let allAuthorsLink of allAuthorsLinks){

    /* [DONE]add tagClickHandler as event listener for that link */

    allAuthorsLink.addEventListener('click', authorClickHandler);

  /* [DONE] END LOOP: for each link */
  }

}

addClickListenersToAuthors();
