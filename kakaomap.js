const mapContainer = document.getElementById("map") // 지도를 표시할 div
const mapOption = {
    center: new kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표
    level: 3, // 지도의 확대 레벨
}

// 지도를 표시할 div와  지도 옵션으로  지도를 생성합니다
const map = new kakao.maps.Map(mapContainer, mapOption)



//키워드로 장소검색

// 장소 검색 객체를 생성합니다
const ps = new kakao.maps.services.Places();
const save = []
let currentOverlay

// 키워드 검색 완료 시 호출되는 콜백함수 입니다
function placesSearchCB(data, status, pagination) {
    if (status === kakao.maps.services.Status.OK) {
        console.log('data', data)
        // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
        // LatLngBounds 객체에 좌표를 추가합니다
        const bounds = new kakao.maps.LatLngBounds();

        for (let i = 0; i < data.length; i++) {
            let marker = displayMarker(data[i])
            let overlay = makeOverlay(marker, data[i])

            let placeSet = {
                marker: marker,
                overlay: overlay
            }

            save.push(placeSet)
            console.dir(save)
            bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x));
        }

        // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
        map.setBounds(bounds);
        save.forEach(displayOverlay)
    }
}

// 지도에 마커를 표시하는 함수입니다
function displayMarker(place) {

    // 마커를 생성하고 지도에 표시합니다
    const marker = new kakao.maps.Marker({
        map: map,
        position: new kakao.maps.LatLng(place.y, place.x),
        clickable: true
    })

    marker.setMap(map)

    return marker
}


// 마커에 해당하는 오버레이 생성
function makeOverlay(marker, place) {
    const overlay = new kakao.maps.CustomOverlay({
        content: makeContent(place),
        map: map,
        position: marker.getPosition(),
    })
    currentOverlay = overlay
    closeOverlay(overlay)
    return overlay
}

// 커스텀 오버레이를 닫기 위해 호출되는 함수입니다 
function closeOverlay() {
    currentOverlay.setMap(null);
}


// 마커에 클릭이벤트를 등록합니다
function displayOverlay(placeSet) {
    kakao.maps.event.addListener(placeSet.marker, 'click', function () {
        //현재 열려있는 overlay 닫기
        closeOverlay()
        placeSet.overlay.setMap(map)
        currentOverlay = placeSet.overlay
    })
}

//장소에 대한 오버레이의 content 작성
function makeContent(place) {
    const phoneError = '연락처 정보가 없습니다'

    let content = '<div class="wrap">' +
        '    <div class="info">' +
        '        <div class="title">' +
        `            ${place.place_name}` +
        '            <div class="close" onclick="closeOverlay()" title="닫기"></div>' +
        '        </div>' +
        '        <div class="body">' +
        // '            <div class="img">' +
        // '                <img src="https://cfile181.uf.daum.net/image/250649365602043421936D" width="73" height="70">' +
        '           </div>' +
        '            <div class="desc">' +
        `              <div class="ellipsis">${place.address_name}</div>` +
        `                <div class="phone ellipsis">${place.phone !== '' ? place.phone : phoneError}</div>` +
        `                <div><a href="${place.place_url}" target="_blank" class="link">카카오맵 상세보기</a></div>` +
        '            </div>' +
        '        </div>' +
        '    </div>' +
        '</div>'

    return content
}



//키워드로 장소를 검색합니다

const input = document.getElementById('input')

//enter 누르면 검색
function onKeyDown(event) {
    place = event.target.value
    console.log(place)
    if (event.key === 'Enter') {
        ps.keywordSearch(place, placesSearchCB)

        //현재 열려있는 overlay 닫기
        closeOverlay()
        //input 비우기
        input.value = ''
    }
}

//지도 크기 변경
function resizeMap() {
    var mapContainer = document.getElementById('map');
    mapContainer.style.width = '100%';
    mapContainer.style.height = '98vh';
}

function relayout() {

    // 지도를 표시하는 div 크기를 변경한 이후 지도가 정상적으로 표출되지 않을 수도 있습니다
    // 크기를 변경한 이후에는 반드시  map.relayout 함수를 호출해야 합니다 
    // window의 resize 이벤트에 의한 크기변경은 map.relayout 함수가 자동으로 호출됩니다
    map.relayout();
}

function init() {
    resizeMap()
    relayout()
    input.addEventListener('keydown', onKeyDown)

}

init()