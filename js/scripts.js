document.addEventListener('DOMContentLoaded', function () {
    const menuToggle = document.querySelector(".menu-toggle");
	const navLinks = document.querySelector(".nav-links");

	menuToggle.addEventListener("click", () => {
		navLinks.classList.toggle("show");
	});
    // Restore previous popup functionality
    const memberPictures = document.querySelectorAll('.member-picture');
    memberPictures.forEach(picture => {
        picture.addEventListener('click', function () {
            const memberId = this.dataset.memberId;
            const memberName = this.dataset.memberName;
            const memberUniversity = this.dataset.memberUniversity;
            const memberImageSrc = this.src;  

            const popup = document.createElement('div');
            popup.classList.add('popup');

            const popupContent = `
                <div class="popup-content">
                    <img src="${memberImageSrc}" alt="${memberName}">
                    <div class="member-details">
                        <h2>${memberName}</h2>
                        <p>${memberUniversity}</p>
                    </div>
                    <span class="close-popup">&times;</span>
                    
                </div>
            `;
            popup.innerHTML = popupContent;

            document.body.appendChild(popup);

            const closePopup = popup.querySelector('.close-popup');
            closePopup.addEventListener('click', function () {
                document.body.removeChild(popup);
            });

            const nextPicButton = popup.querySelector('.next-pic');
            nextPicButton.addEventListener('click', function () {
                const nextMemberId = (parseInt(memberId) % 10) + 1;
                const nextMember = document.getElementById(`member${nextMemberId}`);
                if (nextMember) {
                    const nextMemberImageSrc = nextMember.querySelector('.member-picture').src;
                    const nextMemberName = nextMember.querySelector('.member-picture').getAttribute('alt');
                    const nextMemberUniversity = nextMember.querySelector('.member-picture').dataset.memberUniversity;

                    popup.innerHTML = `
                        <div class="popup-content">
                            <img src="${nextMemberImageSrc}" alt="${nextMemberName}">
                            <div class="member-details">
                                <h2>${nextMemberName}</h2>
                                <p>${nextMemberUniversity}</p>
                            </div>
                            <span class="close-popup">&times;</span>
                        </div>
                    `;
                }
            });

            window.addEventListener('click', function (event) {
                if (event.target === popup) {
                    document.body.removeChild(popup);
                }
            });
        });
    });

    // Carousel functionality
    const galleryTrack = document.querySelector('.gallery-track');
    const members = document.querySelectorAll('.member');
    const leftArrow = document.querySelector('.left');
    const rightArrow = document.querySelector('.right');

    let currentIndex = Math.floor(members.length / 2);

    leftArrow.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + members.length) % members.length;
        updateGallery();
    });

    rightArrow.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % members.length;
        updateGallery();
    });

    function updateGallery() {
        const newPosition = -currentIndex * members[0].offsetWidth;
        galleryTrack.style.transform = `translateX(${newPosition}px)`;

        members.forEach((member, index) => {
            const distanceFromCurrent = Math.abs(index - currentIndex);
            const opacity = 1 - (distanceFromCurrent * 0); // Adjust opacity based on distance from current index
            member.style.opacity = opacity.toFixed(1); // Set opacity with one decimal place
        });
    }

    updateGallery();
});
