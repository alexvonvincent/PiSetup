
export const createScrollPoint = (id) => {
    return <div id= {id}></div>;
}

export const scrolltopoint = (id) => {  
    const element = document.getElementById(id);
    element.scrollIntoView({behavior: "smooth"});
}

