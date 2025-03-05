import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/autoplay";
import { Autoplay } from "swiper/modules";

export default function SwiperCarousel() {
  return (
    <div className="container mx-auto px-16">
      <Swiper
        modules={[Autoplay]}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        loop={true}
        spaceBetween={30} // İstersen artır
        className="w-full mt-20 h-96"
      >
        <SwiperSlide>
          <img
            src="/images/talenthub-1.png"
            className="w-full h-full object-cover"
            alt="TalentHub Ad 1"
          />
        </SwiperSlide>
        <SwiperSlide>
          <img
            src="/images/talenthub-2.png"
            className="w-full h-full object-cover"
            alt="TalentHub Ad 2"
          />
        </SwiperSlide>
        <SwiperSlide>
          <img
            src="/images/talenthub-3.png"
            className="w-full h-full object-cover"
            alt="TalentHub Ad 3"
          />
        </SwiperSlide>
      </Swiper>
    </div>
  );
}
