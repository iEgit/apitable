package com.vikadata.api.model.dto.client;

import javax.servlet.http.Cookie;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClientOriginInfo {

    private String ip;

    private String userAgent;

    private Cookie[] cookies;
}
