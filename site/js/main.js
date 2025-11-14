$(function() {

    /* -------------------------------------
       부드러운 스크롤
    ------------------------------------- */
    $('a[href^="#"]').on('click', function(e) {
        var t = $($(this).attr('href'));
        if (!t.length) return;
        e.preventDefault();
        $('html, body').animate({
            scrollTop: t.offset().top - 60
        }, 600);
    });

    /* -------------------------------------
       헤더 모바일 메뉴 (햄버거)
    ------------------------------------- */
    var $btnMenu = $('.gnb-toggle');
    var $gnb = $('.gnb');
    var $dim = $('.gnb-dim');

    function closeMenu() {
        $gnb.removeClass('open');
        $btnMenu.removeClass('on');
        $dim.removeClass('show');
        $('body').removeClass('menu-open');
    }

    function openMenu() {
        $gnb.addClass('open');
        $btnMenu.addClass('on');
        $dim.addClass('show');
        $('body').addClass('menu-open');
    }

    $btnMenu.on('click', function() {
        if ($gnb.hasClass('open')) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    // 오버레이 클릭 시 닫기
    $dim.on('click', function() {
        closeMenu();
    });

    // 메뉴 항목 클릭 시 닫기
    $('.gnb a').on('click', function() {
        closeMenu();
    });

    // 브라우저가 다시 커지면(PC 사이즈) 강제로 닫기
    $(window).on('resize', function() {
        if (window.innerWidth > 768) {
            closeMenu();
        }
    });

    /* -------------------------------------
       HERO 슬라이드 + 백그라운드 비디오
    ------------------------------------- */
    var $heroSlides = $('.hero-slide');
    var $heroBullets = $('.hero-bullets button');
    var $heroVideo = $('.hero-bg-video');
    var $heroPageCurrent = $('.hero-page-current');
    var $heroPageTotal = $('.hero-page-total');

    // 슬라이드별 비디오 파일
    var heroVideos = [
        'video/CK_td06260002814_1080p.mp4', // 1번
        'video/KakaoTalk_20251023_222924325.mp4', // 2번
        'video/mobility1.mp4', // 3번
        'video/robotics1.mp4' // 4번
    ];

    if ($heroSlides.length) {
        var heroIndex = 0;
        var heroCount = $heroSlides.length;
        var heroTimer = null;

        // 총 페이지 숫자 세팅 (예: 04)
        if ($heroPageTotal.length) {
            $heroPageTotal.text(String(heroCount).padStart(2, '0'));
        }

        function setHeroVideo(index) {
            if (!$heroVideo.length || !heroVideos[index]) return;

            var videoEl = $heroVideo[0];
            var $source = $heroVideo.find('source');

            if ($source.length) {
                // <video><source></video> 구조인 경우
                $source.attr('src', heroVideos[index]);
            } else {
                // <video src="..."> 구조인 경우
                $heroVideo.attr('src', heroVideos[index]);
            }

            try {
                videoEl.load();
                videoEl.play();
            } catch (e) {
                // 콘솔 에러만 방지
                console.warn('hero video play error:', e);
            }
        }

        function changeHeroSlide(index) {
            heroIndex = index;

            // 텍스트 슬라이드
            $heroSlides.removeClass('active').eq(index).addClass('active');

            // 페이지 번호
            if ($heroPageCurrent.length) {
                $heroPageCurrent.text(String(index + 1).padStart(2, '0'));
            }

            // 인디케이터(동그라미)
            if ($heroBullets.length) {
                $heroBullets.removeClass('active').eq(index).addClass('active');
            }

            // 배경 비디오 변경
            setHeroVideo(index);
        }

        function startHeroAuto() {
            if (heroTimer) return;
            heroTimer = setInterval(function() {
                var next = (heroIndex + 1) % heroCount;
                changeHeroSlide(next);
            }, 6000); // 6초마다 전환
        }

        function stopHeroAuto() {
            clearInterval(heroTimer);
            heroTimer = null;
        }

        // 인디케이터 클릭
        $heroBullets.on('click', function() {
            var idx = $(this).data('index');
            stopHeroAuto();
            changeHeroSlide(idx);
            startHeroAuto();
        });

        // 초기 세팅
        changeHeroSlide(0);
        startHeroAuto();
    }

    /* -------------------------------------
       PRODUCT SLIDER
    ------------------------------------- */
    var $productSection = $('.section-products');

    if (!$productSection.length) return; // 제품 섹션이 없으면 실행 안 함

    // 총 슬라이드 개수 설정
    var totalSlides = $productSection.find('.product-thumb-slider .swiper-slide').length;
    $productSection.find('.product-page-total').text(String(totalSlides).padStart(2, '0'));

    var productSwiper = new Swiper($productSection.find('.product-thumb-slider')[0], { // Swiper는 DOM 요소가 필요
        slidesPerView: 'auto',
        spaceBetween: 18,
        loop: true,
        slideToClickedSlide: true,
        thumbs: {},
        navigation: {
            nextEl: $productSection.find('.products-arrows .next')[0],
            prevEl: $productSection.find('.products-arrows .prev')[0],
        },
        on: {
            init: function(swiper) {
                updateProductContent(swiper, $productSection);
            },
            slideChange: function(swiper) {
                updateProductContent(swiper, $productSection);
            }
        }
    });

    // 메인 콘텐츠 업데이트 함수
    function updateProductContent(swiper, $section) {
        var activeIndex = swiper.realIndex;
        var $activeSlide = $(swiper.slides).filter(function() {
            return $(this).data('swiper-slide-index') == activeIndex;
        }).first();

        if (!$activeSlide.length) {
            $activeSlide = $(swiper.slides[swiper.activeIndex]);
        }

        // data-* 속성에서 값 읽어오기
        var name = $activeSlide.data('name');
        var sub = $activeSlide.data('sub');
        var desc = $activeSlide.data('desc');
        var imgSrc = $activeSlide.data('img-src');

        // HTML 요소에 값 적용하기 (해당 섹션 내부에서만)
        if (name) $section.find('#product-name').text(name);
        if (sub) $section.find('#product-sub').text(sub);
        if (desc) $section.find('#product-desc').text(desc);
        if (imgSrc) $section.find('#product-main-img').attr('src', imgSrc);

        // 현재 페이지 번호 업데이트 (해당 섹션 내부에서만)
        $section.find('.product-page-current').text(String(activeIndex + 1).padStart(2, '0'));
    }


    /* ===========================
       FIELD 섹션 탭 전환 (빠르고 자연스럽게)
    ============================ */
    var $fieldSection = $('.section-field');
    if (!$fieldSection.length) return; // 섹션 없으면 실행 안 함

    var fieldFirstLoad = true;

    // 캐싱 대신 $fieldSection.find()로 정확히 타겟팅
    var $card = $fieldSection.find('.field-card');
    var $title = $fieldSection.find('#field-title');
    var $desc = $fieldSection.find('#field-desc');
    var $image = $fieldSection.find('#field-image');
    var $btnBox = $fieldSection.find('#field-buttons');

    // data-* 속성을 읽어 카드를 업데이트하는 함수
    function applyFieldData($targetLi) {
        var title = $targetLi.data('title');
        var desc = $targetLi.data('desc');
        var img = $targetLi.data('img');
        var buttons = $targetLi.data('buttons'); // "버튼1,버튼2"

        if (!title) return; // 데이터 없으면 중단

        $title.text(title);
        $desc.text(desc);
        $image.attr('src', img);

        // 버튼 다시 세팅
        $btnBox.empty();
        if (buttons) {
            var buttonLabels = buttons.split(','); // 쉼표로 분리
            buttonLabels.forEach(function(label) {
                $('<button type="button">').text(label).appendTo($btnBox);
            });
        }
    }

    function updateField($targetLi) {
        // 첫 로딩: 애니메이션 없이 바로 세팅
        if (fieldFirstLoad) {
            applyFieldData($targetLi);
            fieldFirstLoad = false;
            return;
        }

        // 빠르게 fadeOut → 내용 바꾸고 → fadeIn
        $card.stop(true, true).fadeOut(100, function() {
            applyFieldData($targetLi);
            $card.fadeIn(100);
        });
    }

    // 왼쪽 리스트 클릭
    $fieldSection.find('.field-list').on('click', '.field-item', function() {
        var $clickedLi = $(this);

        // 이미 활성화된 항목을 클릭하면 중단
        if ($clickedLi.hasClass('active')) {
            return;
        }

        $fieldSection.find('.field-item').removeClass('active');
        $clickedLi.addClass('active');

        updateField($clickedLi);
    });

    // 처음 진입 시: .active가 붙은 항목을 기본으로
    var $initialActive = $fieldSection.find('.field-item.active').first();
    if ($initialActive.length) {
        updateField($initialActive);
    }


    /* -------------------------------------
       NEWS SLIDER (Swiper.js)
    ------------------------------------- */
    // swiper 로 변경
    var newsSwiper = new Swiper('.news-swiper', {
        // CSS에서 설정한 .swiper-slide의 width(360px 또는 70%)를
        // 자동으로 인식하여 슬라이드를 배치합니다.
        slidesPerView: 'auto',

        // 무한 루프
        loop: true,

        // CSS의 gap: 32px와 동일하게 설정
        spaceBetween: 32,

        // 마우스 휠 스크롤
        mousewheel: {
            forceToAxis: true,
        },

        // freeMode 제거 (정확한 위치에 스냅되도록)

        // 자동 재생 (기존 5초)
        autoplay: {
            delay: 5000,
            disableOnInteraction: false, // 사용자가 조작한 후에도 자동재생 유지
        },

        // 모바일 갭 (768px 이하)
        breakpoints: {
            // 768px 이하일 때
            768: {
                spaceBetween: 24 // CSS의 gap: 24px와 동일하게
            }
        }
    });


    /* -------------------------------------
       SCROLL FADE-IN
    ------------------------------------- */
    function checkFadeItems() {
        $('.fade-item').each(function() {
            var top = $(this).offset().top;
            var scroll = $(window).scrollTop();
            var winH = $(window).height();

            if (top < scroll + winH * 0.85) {
                $(this).addClass('show');
            }
        });
    }

    checkFadeItems();
    $(window).on('scroll', checkFadeItems);

});