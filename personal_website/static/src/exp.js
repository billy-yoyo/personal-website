APPS.push(() => {

    const expList = Array.from(document.querySelectorAll(".experience-list .exp"));
    const expItemList = Array.from(document.querySelectorAll(".experience-view .exp-item"));


    const onClickExp = (e) => {
        expList.forEach(el => el.classList.remove('selected'));
        e.target.classList.add('selected');
        const name = e.target.dataset.name;

        const item = expItemList.find(el => el.dataset.name === name);
        expItemList.forEach(el => el.classList.remove('selected'));
        if (item) {
            item.classList.add('selected');
        }
    };

    expList.forEach(el => el.addEventListener('click', onClickExp));
});