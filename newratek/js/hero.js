$(function () {
    const $hero = $('.hero');
    if (!$hero.length) return;

    const $slides = $hero.find('.hero-slide');
    const $video = $hero.find('.hero-bg-video');
    const $current = $hero.find('.hero-page-current');
    const $next = $hero.find('.hero-page-next');
    const $progress = $hero.find('.hero-progress-bar');

    const total = $slides.length;
    const DURATION = 6000;
    let index = 0;
    let timerId = null;

    if (!total || !$video.length) return;

    // src만 바꾸고 load() 하는 방식 (autoplay 유지됨)
    function setVideoSource(src) {
        if (!src) return;

        // 기존 src 제거
        $video.removeAttr('src');
        $video.find('source').remove();

        // 새 src 넣고 load
        $video.attr('src', src);
        $video[0].load();

        // 바로 재생 강제 (필수!)
        $video[0].play().catch(() => {});
    }

    function updatePagination() {
        const cur = String(index + 1).padStart(2, '0');
        const nextIndex = (index + 1) % total;
        const nxt = String(nextIndex + 1).padStart(2, '0');
        $current.text(cur);
        $next.text(nxt);
    }

    function restartProgress() {
        $progress.stop(true, true).css('width', '0%').animate({ width: '100%' }, DURATION, 'linear');
    }

    function show(i) {
        index = (i + total) % total;
        $slides.removeClass('active').eq(index).addClass('active');

        const src = $slides.eq(index).data('video');
        setVideoSource(src);

        updatePagination();
        restartProgress();
    }

    function startAuto() {
        if (timerId) clearInterval(timerId);
        timerId = setInterval(() => show(index + 1), DURATION);
    }

    // 첫 슬라이드에 active 미리 줘서 텍스트 보이게 + 강제 시작
    show(0);
    startAuto();
});