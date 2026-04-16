package kr.co.iei.market.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MarketResponse<T> {
	private int code;
	private String message;
	private T data;
}
