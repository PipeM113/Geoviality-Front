import { useEffect } from 'react';

export const useNavbarAnimation = () => {
  const test = () => {
    const tabsNewAnim = document.getElementById('navbarSupportedContent');
    const activeItemNewAnim = tabsNewAnim?.querySelector('.active') as HTMLElement;
    const horiSelector = document.querySelector('.hori-selector') as HTMLElement;

    if (activeItemNewAnim && horiSelector) {
      const activeWidthNewAnimHeight = activeItemNewAnim.clientHeight;
      const activeWidthNewAnimWidth = activeItemNewAnim.clientWidth;
      const itemPosNewAnimTop = activeItemNewAnim.offsetTop;
      const itemPosNewAnimLeft = activeItemNewAnim.offsetLeft;

      horiSelector.style.top = itemPosNewAnimTop + "px";
      horiSelector.style.left = itemPosNewAnimLeft + "px";
      horiSelector.style.height = activeWidthNewAnimHeight + "px";
      horiSelector.style.width = activeWidthNewAnimWidth + "px";
    }

    tabsNewAnim?.addEventListener('click', (e) => {
      const target = (e.target as HTMLElement).closest('li') as HTMLElement;
      if (target) {
        tabsNewAnim.querySelectorAll('li').forEach(li => li.classList.remove('active'));
        target.classList.add('active');

        const activeWidthNewAnimHeight = target.clientHeight;
        const activeWidthNewAnimWidth = target.clientWidth;
        const itemPosNewAnimTop = target.offsetTop;
        const itemPosNewAnimLeft = target.offsetLeft;

        if (horiSelector) {
          horiSelector.style.top = itemPosNewAnimTop + "px";
          horiSelector.style.left = itemPosNewAnimLeft + "px";
          horiSelector.style.height = activeWidthNewAnimHeight + "px";
          horiSelector.style.width = activeWidthNewAnimWidth + "px";
        }
      }
    });
  };

  useEffect(() => {
    setTimeout(test, 500);
    window.addEventListener('resize', () => setTimeout(test, 500));
  });
};
